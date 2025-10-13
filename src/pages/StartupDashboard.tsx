import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Upload, Eye, MessageSquare, TrendingUp, 
  Users, DollarSign, FileText, Settings 
} from "lucide-react";

const StartupDashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back, John!</h1>
              <p className="text-muted-foreground">Here's what's happening with your startup</p>
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
              {/* Pitch Status */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    My Startup Pitch
                  </CardTitle>
                  <CardDescription>Manage your pitch deck and details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-semibold mb-1">TechFlow AI - Series A</div>
                      <div className="text-sm text-muted-foreground">Last updated 2 days ago</div>
                    </div>
                    <Badge className="bg-green-500">Approved</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">Problem Statement</div>
                        <p className="text-sm text-muted-foreground">
                          Traditional project management tools lack AI-powered insights and automation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">Solution</div>
                        <p className="text-sm text-muted-foreground">
                          AI-powered platform that automates task management and provides predictive analytics.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="btn-hero flex-1">
                      <Upload className="w-4 h-4 mr-2" />
                      Update Pitch Deck
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>

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
