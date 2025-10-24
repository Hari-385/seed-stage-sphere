import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";

interface PitchReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: any;
  onDecisionMade: () => void;
}

export const PitchReviewModal = ({ open, onOpenChange, analysis, onDecisionMade }: PitchReviewModalProps) => {
  const [status, setStatus] = useState<string>("pending");
  const [grantedAmount, setGrantedAmount] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!analysis) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const decisionData: any = {
        pitch_analysis_id: analysis.id,
        investor_id: user.id,
        status,
        feedback,
      };

      if (grantedAmount) {
        decisionData.granted_amount = parseFloat(grantedAmount);
      }

      const { error } = await supabase
        .from('investment_decisions')
        .upsert(decisionData, {
          onConflict: 'pitch_analysis_id,investor_id'
        });

      if (error) throw error;

      toast.success("Investment decision saved successfully!");
      onDecisionMade();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to save decision: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Pitch</DialogTitle>
          <DialogDescription>
            Evaluate the startup pitch and make your investment decision
          </DialogDescription>
        </DialogHeader>

        {analysis && (
          <div className="space-y-6">
            {/* Pitch Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{analysis.title || "Untitled Pitch"}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.pitch_description}</p>
              {analysis.category && (
                <Badge className="mt-2">{analysis.category}</Badge>
              )}
            </div>

            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(analysis.overall_score || 0)}`}>
                {analysis.overall_score || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground mb-3">Overall Score</div>
              {analysis.investment_recommendation && (
                <Badge className={
                  analysis.investment_recommendation === 'Strong Buy' ? 'bg-green-500' :
                  analysis.investment_recommendation === 'Buy' ? 'bg-green-400' :
                  analysis.investment_recommendation === 'Pass' ? 'bg-red-500' :
                  ''
                }>
                  {analysis.investment_recommendation}
                </Badge>
              )}
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <div className="text-xs text-muted-foreground mb-1">Market Size</div>
                <div className={`text-xl font-bold ${getScoreColor(analysis.market_size_score || 0)}`}>
                  {analysis.market_size_score || "N/A"}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <Users className="w-5 h-5 text-secondary mb-2" />
                <div className="text-xs text-muted-foreground mb-1">Team Strength</div>
                <div className={`text-xl font-bold ${getScoreColor(analysis.team_strength_score || 0)}`}>
                  {analysis.team_strength_score || "N/A"}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <FileText className="w-5 h-5 text-accent mb-2" />
                <div className="text-xs text-muted-foreground mb-1">Product Viability</div>
                <div className={`text-xl font-bold ${getScoreColor(analysis.product_viability_score || 0)}`}>
                  {analysis.product_viability_score || "N/A"}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500 mb-2" />
                <div className="text-xs text-muted-foreground mb-1">Financial Health</div>
                <div className={`text-xl font-bold ${getScoreColor(analysis.financial_health_score || 0)}`}>
                  {analysis.financial_health_score || "N/A"}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
                <div className="text-xs text-muted-foreground mb-1">Competitive Edge</div>
                <div className={`text-xl font-bold ${getScoreColor(analysis.competitive_advantage_score || 0)}`}>
                  {analysis.competitive_advantage_score || "N/A"}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.key_strengths && analysis.key_strengths.length > 0 && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Key Strengths</h4>
                  <ul className="space-y-1 text-sm">
                    {analysis.key_strengths.map((strength: string, idx: number) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.key_concerns && analysis.key_concerns.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Key Concerns
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {analysis.key_concerns.map((concern: string, idx: number) => (
                      <li key={idx}>• {concern}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Investment Decision Form */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Your Investment Decision</h3>
              
              <div className="space-y-2">
                <Label htmlFor="status">Decision *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in USD"
                  value={grantedAmount}
                  onChange={(e) => setGrantedAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback/Notes (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Add your comments or feedback for the founder"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="btn-hero flex-1"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Decision"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};