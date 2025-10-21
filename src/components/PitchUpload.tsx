import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PitchUploadProps {
  startupId: string;
  onUploadComplete?: () => void;
}

export const PitchUpload = ({ startupId, onUploadComplete }: PitchUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileName = `${user.id}/${startupId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('pitch-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast.success("File uploaded successfully");

      // Read file content for analysis
      const fileText = await file.text();

      // Get startup details
      const { data: startup } = await supabase
        .from('startups')
        .select('name, domain, description')
        .eq('id', startupId)
        .single();

      if (!startup) throw new Error("Startup not found");

      // Create initial analysis record
      const { data: analysisRecord, error: insertError } = await supabase
        .from('pitch_analyses')
        .insert({
          startup_id: startupId,
          file_name: file.name,
          file_path: fileName,
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
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload/analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process pitch");
    } finally {
      setUploading(false);
      setAnalyzing(false);
      // Reset file input
      event.target.value = '';
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
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="pitch-upload"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              disabled={uploading || analyzing}
            />
            <label htmlFor="pitch-upload" className="cursor-pointer">
              {uploading || analyzing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="font-medium">
                    {uploading ? "Uploading..." : "Analyzing pitch..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analyzing && "This may take a minute"}
                  </p>
                </div>
              ) : (
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
              )}
            </label>
          </div>
          <div className="text-xs text-muted-foreground">
            Your pitch will be analyzed using AI to provide insights on market potential, team strength, and investment viability.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};