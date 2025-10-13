import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, Bookmark, MessageSquare, TrendingUp, 
  Briefcase, Target, Filter, Settings 
} from "lucide-react";

const InvestorDashboard = () => {
  const savedStartups = [
    {
      name: "TechFlow AI",
      domain: "AI/ML",
      funding: "$500K",
      stage: "Series A",
      description: "AI-powered project management platform with predictive analytics"
    },
    {
      name: "HealthSync",
      domain: "HealthTech",
      funding: "$1M",
      stage: "Series B",
      description: "Revolutionary telemedicine platform connecting patients with specialists"
    },
    {
      name: "GreenEnergy Solutions",
      domain: "CleanTech",
      funding: "$750K",
      stage: "Seed",
      description: "Sustainable energy solutions for residential and commercial properties"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back, Investor!</h1>
              <p className="text-muted-foreground">Discover your next investment opportunity</p>
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
                    <Bookmark className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-sm text-muted-foreground">Saved Startups</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-secondary" />
                  </div>
                  <Badge variant="secondary">5 new</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">23</div>
                <div className="text-sm text-muted-foreground">Active Conversations</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">8</div>
                <div className="text-sm text-muted-foreground">Portfolio Companies</div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <Badge className="bg-green-500">+15%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">125</div>
                <div className="text-sm text-muted-foreground">New Startups</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Browse Actions */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Discover Startups
                  </CardTitle>
                  <CardDescription>Find your next investment opportunity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link to="/browse" className="block">
                      <Button className="btn-hero w-full h-24 flex flex-col gap-2">
                        <Search className="w-6 h-6" />
                        <span>Browse All Startups</span>
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <Filter className="w-6 h-6" />
                      <span>Filter by Domain</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Startups */}
              <Card className="glass border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="w-5 h-5" />
                      Saved Startups
                    </CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedStartups.map((startup, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{startup.name}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{startup.domain}</Badge>
                            <Badge variant="outline">{startup.stage}</Badge>
                            <Badge className="bg-green-500">{startup.funding}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{startup.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="btn-hero flex-1">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Investment Preferences */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Investment Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">AI/ML</span>
                    <Badge>High Interest</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">FinTech</span>
                    <Badge>High Interest</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">HealthTech</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    Update Preferences
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 pb-3 border-b border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bookmark className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Saved startup</p>
                      <p className="text-xs text-muted-foreground">You saved GreenEnergy Solutions</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pb-3 border-b border-border/50">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Message received</p>
                      <p className="text-xs text-muted-foreground">TechFlow AI replied to you</p>
                      <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New matches</p>
                      <p className="text-xs text-muted-foreground">5 startups match your criteria</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="glass border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Investor Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Early engagement with founders shows serious interest. Don't hesitate to reach out and start a conversation!
                  </p>
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

export default InvestorDashboard;
