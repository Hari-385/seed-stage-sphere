import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PitchUpload } from "@/components/PitchUpload";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { 
  Eye, MessageSquare, TrendingUp, 
  Users, DollarSign, FileText, Settings 
} from "lucide-react";

interface Startup {
  id: string;
  name: string;
  domain: string;
  stage: string;
  funding: string;
  description: string;
}

const StartupDashboard = () => {
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [pitchAnalysis, setPitchAnalysis] = useState<any>(null);
  const [investorDecisions, setInvestorDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Fetch user's startup
      const { data: startupData } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setStartup(startupData);

      // Fetch pitch analysis if startup exists
      if (startupData) {
        const { data: analysisData } = await supabase
          .from('pitch_analyses')
          .select('*')
          .eq('startup_id', startupData.id)
          .eq('analysis_status', 'completed')
          .order('uploaded_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setPitchAnalysis(analysisData);

        // Fetch investor decisions if analysis exists
        if (analysisData) {
          const { data: decisionsData } = await supabase
            .from('investment_decisions')
            .select(`
              *,
              profiles (
                full_name,
                email
              )
            `)
            .eq('pitch_analysis_id', analysisData.id)
            .order('created_at', { ascending: false });
          
          setInvestorDecisions(decisionsData || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleUploadComplete = () => {
    // Refetch analysis after upload
    if (startup) {
      supabase
        .from('pitch_analyses')
        .select('*')
        .eq('startup_id', startup.id)
        .eq('analysis_status', 'completed')
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => setPitchAnalysis(data));
    }
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'Founder';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back, {firstName}!</h1>
              <p className="text-muted-foreground">
                {startup ? `Managing ${startup.name}` : "Set up your startup profile to get started"}
              </p>
            </div>
            <Link to="/settings">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">+12%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">248</div>
                <div className="text-sm text-muted-foreground">Profile Views</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <Badge variant="secondary">+5</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">18</div>
                <div className="text-sm text-muted-foreground">Interested Investors</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <Badge variant="secondary">3 new</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">$500K</div>
                <div className="text-sm text-muted-foreground">Funding Goal</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pitch Upload */}
              {startup && <PitchUpload startupId={startup.id} onUploadComplete={handleUploadComplete} />}

              {!startup && (
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle>Create Your Startup Profile</CardTitle>
                    <CardDescription>Set up your startup profile before uploading pitch materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/settings">
                      <Button className="btn-hero">
                        <Settings className="w-4 h-4 mr-2" />
                        Go to Settings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Startup Info */}
              {startup && (
                <Card className="glass border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Startup Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-semibold mb-1">{startup.name}</div>
                        <div className="text-sm text-muted-foreground">{startup.description}</div>
                      </div>
                      <Badge className="bg-green-500">{startup.stage}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Domain</div>
                        <div className="font-medium">{startup.domain}</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Funding</div>
                        <div className="font-medium">{startup.funding}</div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Link to="/settings" className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <Link to="/browse" className="block">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <Users className="w-6 h-6" />
                      <span>Browse Investors</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <MessageSquare className="w-6 h-6" />
                    <span>Messages</span>
                  </Button>
                  <Link to="/resources" className="block">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <FileText className="w-6 h-6" />
                      <span>Resources</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <TrendingUp className="w-6 h-6" />
                    <span>Analytics</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Investor Decisions */}
              {investorDecisions.length > 0 && (
                <Card className="glass border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Investment Decisions
                      </CardTitle>
                      <Badge variant="secondary">{investorDecisions.length}</Badge>
                    </div>
                    <CardDescription>Investors who reviewed your pitch</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investorDecisions.map((decision) => (
                      <div key={decision.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold">{decision.profiles?.full_name || "Anonymous Investor"}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(decision.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={
                            decision.status === 'accepted' ? 'bg-green-500' :
                            decision.status === 'rejected' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }>
                            {decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}
                          </Badge>
                        </div>
                        {decision.granted_amount && (
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">Investment Amount: </span>
                            <span className="text-sm font-semibold text-green-600">
                              ${decision.granted_amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {decision.feedback && (
                          <p className="text-sm text-muted-foreground">{decision.feedback}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Pitch Analysis Score */}
              {pitchAnalysis && (
                <Card className="glass border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardHeader>
                    <CardTitle>Your Pitch Score</CardTitle>
                    <CardDescription>AI-powered analysis of your pitch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-6xl font-bold mb-2 ${
                        (pitchAnalysis.overall_score || 0) >= 75 ? 'text-green-500' :
                        (pitchAnalysis.overall_score || 0) >= 50 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {pitchAnalysis.overall_score || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">Overall Score</div>
                      {pitchAnalysis.investment_recommendation && (
                        <Badge className={
                          pitchAnalysis.investment_recommendation === 'Strong Buy' ? 'bg-green-500' :
                          pitchAnalysis.investment_recommendation === 'Buy' ? 'bg-green-400' :
                          pitchAnalysis.investment_recommendation === 'Pass' ? 'bg-red-500' :
                          ''
                        }>
                          {pitchAnalysis.investment_recommendation}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Market Size", score: pitchAnalysis.market_size_score },
                        { label: "Team Strength", score: pitchAnalysis.team_strength_score },
                        { label: "Product", score: pitchAnalysis.product_viability_score },
                        { label: "Financial", score: pitchAnalysis.financial_health_score },
                        { label: "Competitive Edge", score: pitchAnalysis.competitive_advantage_score }
                      ].map(({ label, score }) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className={`font-semibold ${
                            (score || 0) >= 75 ? 'text-green-500' :
                            (score || 0) >= 50 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {score || 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Recent Activity */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 pb-3 border-b border-border/50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New investor interested</p>
                      <p className="text-xs text-muted-foreground">Sarah Chen viewed your profile</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pb-3 border-b border-border/50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New message</p>
                      <p className="text-xs text-muted-foreground">Michael Zhang sent you a message</p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile views spike</p>
                      <p className="text-xs text-muted-foreground">+45 views this week</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="glass border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Startups with complete profiles get 3x more investor interest. Make sure to add your team info and market analysis!
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StartupDashboard;
