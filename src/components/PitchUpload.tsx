import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const pitchFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  category: z.string().min(1, "Category is required"),
  requiredAmount: z.string().min(1, "Required amount is required"),
});

interface PitchUploadProps {
  startupId: string;
  onUploadComplete?: () => void;
}

export const PitchUpload = ({ startupId, onUploadComplete }: PitchUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof pitchFormSchema>>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      requiredAmount: "",
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL for PDFs
    if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    event.target.value = '';
  };

  const onSubmit = async (values: z.infer<typeof pitchFormSchema>) => {
    if (!selectedFile || !user) return;

    setUploading(true);

    try {
      // Upload file to storage
      const fileName = `${user.id}/${startupId}/${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('pitch-files')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      toast.success("File uploaded successfully");

      // Read file content for analysis
      const fileText = await selectedFile.text();

      // Get startup details
      const { data: startup } = await supabase
        .from('startups')
        .select('name, domain, description')
        .eq('id', startupId)
        .single();

      if (!startup) throw new Error("Startup not found");

      // Create initial analysis record with form data
      const { data: analysisRecord, error: insertError } = await supabase
        .from('pitch_analyses')
        .insert({
          startup_id: startupId,
          file_name: selectedFile.name,
          file_path: fileName,
          title: values.title,
          pitch_description: values.description,
          category: values.category,
          required_amount: values.requiredAmount,
          analysis_status: 'processing'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploading(false);
      setAnalyzing(true);

      // Analyze pitch using edge function
      const pitchContent = `
Startup: ${startup.name}
Description: ${startup.description}

Pitch Document:
${fileText}
      `.trim();

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-pitch', {
        body: {
          pitchContent,
          startupName: startup.name,
          domain: startup.domain
        }
      });

      if (analysisError) {
        console.error("Analysis error:", analysisError);
        throw new Error("Failed to analyze pitch");
      }

      // Update analysis record with results
      const { error: updateError } = await supabase
        .from('pitch_analyses')
        .update({
          analysis_status: 'completed',
          market_size_score: analysisData.market_size_score,
          team_strength_score: analysisData.team_strength_score,
          product_viability_score: analysisData.product_viability_score,
          financial_health_score: analysisData.financial_health_score,
          competitive_advantage_score: analysisData.competitive_advantage_score,
          overall_score: analysisData.overall_score,
          key_strengths: analysisData.key_strengths,
          key_concerns: analysisData.key_concerns,
          market_insights: analysisData.market_insights,
          team_analysis: analysisData.team_analysis,
          financial_summary: analysisData.financial_summary,
          risk_factors: analysisData.risk_factors,
          investment_recommendation: analysisData.investment_recommendation
        })
        .eq('id', analysisRecord.id);

      if (updateError) throw updateError;

      toast.success("Pitch analyzed successfully!");
      setDialogOpen(false);
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload/analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process pitch");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <Card className="glass border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upload Pitch Deck
        </CardTitle>
        <CardDescription>Upload your pitch document for AI-powered analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Click to upload pitch deck</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOCX, or TXT (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Pitch Details</DialogTitle>
              <DialogDescription>
                Provide details about your pitch and upload your pitch deck
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pitch Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pitch title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your pitch briefly" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Seed">Seed Round</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Series C+">Series C+</SelectItem>
                          <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $500K" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Pitch File</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="pitch-file-input"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileSelect}
                      disabled={uploading || analyzing}
                    />
                    <label htmlFor="pitch-file-input" className="cursor-pointer">
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to select file (PDF, DOCX, or TXT)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {previewUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>File Preview</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full
                      </Button>
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full h-[300px] border rounded-lg"
                      title="PDF Preview"
                    />
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      form.reset();
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    disabled={uploading || analyzing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedFile || uploading || analyzing}
                    className="btn-hero"
                  >
                    {uploading || analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploading ? "Uploading..." : "Analyzing..."}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="text-xs text-muted-foreground mt-4">
          Your pitch will be analyzed using AI to provide insights on market potential, team strength, and investment viability.
        </div>
      </CardContent>
    </Card>
  );
};