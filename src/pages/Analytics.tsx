import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Target, Users, DollarSign, Briefcase, ArrowLeft, BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface PitchAnalysis {
  id: string;
  startup_id: string;
  file_name: string;
  uploaded_at: string;
  analysis_status: string;
  market_size_score: number | null;
  team_strength_score: number | null;
  product_viability_score: number | null;
  financial_health_score: number | null;
  competitive_advantage_score: number | null;
  overall_score: number | null;
  key_strengths: string[] | null;
  key_concerns: string[] | null;
  market_insights: string | null;
  team_analysis: string | null;
  financial_summary: string | null;
  risk_factors: string[] | null;
  investment_recommendation: string | null;
  startups?: {
    name: string;
    logo: string;
    domain: string;
    stage: string;
    funding: string;
  };
}

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<PitchAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<PitchAnalysis | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        toast.error("Please login to view analytics");
        navigate("/login");
        return;
      }

      // Check if user is investor
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (userRole?.role !== 'investor') {
        toast.error("Only investors can access analytics");
        navigate("/dashboard/startup");
        return;
      }

      fetchAnalyses();
    };

    checkAccess();
  }, [user, navigate]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('pitch_analyses')
        .select(`
          *,
          startups (
            name,
            logo,
            domain,
            stage,
            funding
          )
        `)
        .eq('analysis_status', 'completed')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setAnalyses(data || []);
      if (data && data.length > 0) {
        setSelectedAnalysis(data[0]);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getRecommendationBadge = (recommendation: string | null) => {
    if (!recommendation) return null;
    
    const config = {
      "Strong Buy": { variant: "default" as const, className: "bg-green-500" },
      "Buy": { variant: "secondary" as const, className: "bg-green-400" },
      "Hold": { variant: "secondary" as const, className: "" },
      "Pass": { variant: "destructive" as const, className: "" }
    };

    const rec = config[recommendation as keyof typeof config] || config["Hold"];
    return <Badge variant={rec.variant} className={rec.className}>{recommendation}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <Button variant="outline" onClick={() => navigate("/dashboard/investor")} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Card className="glass border-0">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No Analytics Available</h3>
                <p className="text-muted-foreground">
                  No startup pitch analyses are available yet. Check back later for insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <Button variant="outline" onClick={() => navigate("/dashboard/investor")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">Startup Analytics</h1>
            <p className="text-muted-foreground">AI-powered pitch analysis and investment insights</p>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{analyses.length}</div>
                <div className="text-sm text-muted-foreground">Analyzed Startups</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <Badge className="bg-green-500">
                    {analyses.filter(a => (a.overall_score || 0) >= 70).length}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">High Potential</div>
                <div className="text-sm text-muted-foreground">Score ≥ 70</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {Math.round(analyses.reduce((acc, a) => acc + (a.overall_score || 0), 0) / analyses.length)}
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {new Set(analyses.map(a => a.startups?.domain)).size}
                </div>
                <div className="text-sm text-muted-foreground">Industries</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Startup List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Analyzed Startups</h2>
              {analyses.map((analysis) => (
                <Card 
                  key={analysis.id}
                  className={`glass border-0 cursor-pointer transition-all ${
                    selectedAnalysis?.id === analysis.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{analysis.startups?.logo}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{analysis.startups?.name}</h3>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{analysis.startups?.domain}</Badge>
                          <Badge variant="secondary" className="text-xs">{analysis.startups?.stage}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                        {analysis.overall_score || 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Analysis */}
            {selectedAnalysis && (
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <Card className="glass border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{selectedAnalysis.startups?.logo}</div>
                        <div>
                          <CardTitle className="text-3xl mb-2">{selectedAnalysis.startups?.name}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge>{selectedAnalysis.startups?.domain}</Badge>
                            <Badge variant="outline">{selectedAnalysis.startups?.stage}</Badge>
                            <Badge className="bg-green-500">{selectedAnalysis.startups?.funding}</Badge>
                          </div>
                        </div>
                      </div>
                      {getRecommendationBadge(selectedAnalysis.investment_recommendation)}
                    </div>
                  </CardHeader>
                </Card>

                {/* Scores */}
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle>Investment Scores</CardTitle>
                    <CardDescription>Comprehensive analysis across key metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Market Size", score: selectedAnalysis.market_size_score, icon: Target },
                      { label: "Team Strength", score: selectedAnalysis.team_strength_score, icon: Users },
                      { label: "Product Viability", score: selectedAnalysis.product_viability_score, icon: CheckCircle2 },
                      { label: "Financial Health", score: selectedAnalysis.financial_health_score, icon: DollarSign },
                      { label: "Competitive Advantage", score: selectedAnalysis.competitive_advantage_score, icon: TrendingUp }
                    ].map(({ label, score, icon: Icon }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                            {score || 'N/A'}
                          </span>
                        </div>
                        <Progress value={score || 0} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Key Insights */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedAnalysis.key_strengths?.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="glass border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Key Concerns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedAnalysis.key_concerns?.map((concern, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span className="text-sm">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle>Market Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedAnalysis.market_insights}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle>Team Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedAnalysis.team_analysis}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedAnalysis.financial_summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Risk Factors */}
                <Card className="glass border-0 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedAnalysis.risk_factors?.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-destructive mt-1">⚠</span>
                          <span className="text-sm">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;