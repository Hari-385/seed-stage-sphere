import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Bell, Shield, Rocket } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role: "" as "founder" | "investor",
  });

  const [startup, setStartup] = useState({
    name: "",
    domain: "",
    stage: "",
    funding: "",
    description: "",
  });

  const [hasStartup, setHasStartup] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    messages: true,
    updates: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, loading, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name,
          email: data.email,
          role: data.role,
        });

        // Load startup if user is a founder
        if (data.role === 'founder') {
          const { data: startupData } = await supabase
            .from('startups')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (startupData) {
            setStartup({
              name: startupData.name,
              domain: startupData.domain,
              stage: startupData.stage,
              funding: startupData.funding,
              description: startupData.description,
            });
            setHasStartup(true);
          }
        }
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save settings");
    }
  };

  const handleSaveStartup = async () => {
    if (!user) return;

    if (!startup.name || !startup.domain || !startup.stage || !startup.funding || !startup.description) {
      toast.error("Please fill in all startup fields");
      return;
    }

    try {
      if (hasStartup) {
        // Update existing startup
        const { error } = await supabase
          .from('startups')
          .update({
            name: startup.name,
            domain: startup.domain,
            stage: startup.stage,
            funding: startup.funding,
            description: startup.description,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new startup
        const { error } = await supabase
          .from('startups')
          .insert({
            user_id: user.id,
            name: startup.name,
            domain: startup.domain,
            stage: startup.stage,
            funding: startup.funding,
            description: startup.description,
          });

        if (error) throw error;
        setHasStartup(true);
      }

      toast.success("Startup profile saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save startup profile");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account settings and preferences</p>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl text-white font-bold">
                    {profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role === 'founder' ? 'Startup Founder' : 'Investor'}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">Role cannot be changed</p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Message Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified about new messages</div>
                  </div>
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Product Updates</div>
                    <div className="text-sm text-muted-foreground">Stay updated with new features</div>
                  </div>
                  <Switch
                    checked={notifications.updates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Startup Profile - Only for Founders */}
            {profile.role === 'founder' && (
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Startup Profile
                  </CardTitle>
                  <CardDescription>
                    {hasStartup ? "Update your startup information" : "Create your startup profile to start connecting with investors"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startup-name">Startup Name *</Label>
                    <Input
                      id="startup-name"
                      placeholder="Enter your startup name"
                      value={startup.name}
                      onChange={(e) => setStartup({ ...startup, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Industry/Domain *</Label>
                    <Input
                      id="domain"
                      placeholder="e.g., FinTech, HealthTech, EdTech"
                      value={startup.domain}
                      onChange={(e) => setStartup({ ...startup, domain: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select value={startup.stage} onValueChange={(value) => setStartup({ ...startup, stage: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="Seed">Seed</SelectItem>
                        <SelectItem value="Series A">Series A</SelectItem>
                        <SelectItem value="Series B">Series B</SelectItem>
                        <SelectItem value="Series C+">Series C+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="funding">Funding Goal *</Label>
                    <Input
                      id="funding"
                      placeholder="e.g., $500K, $1M, $5M"
                      value={startup.funding}
                      onChange={(e) => setStartup({ ...startup, funding: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your startup, what problem you're solving, and your unique value proposition"
                      value={startup.description}
                      onChange={(e) => setStartup({ ...startup, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <Button className="btn-hero w-full" onClick={handleSaveStartup}>
                    {hasStartup ? "Update Startup Profile" : "Create Startup Profile"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Change Password
                </Button>
                <div className="pt-4 border-t border-border">
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Once you delete your account, there is no going back.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button className="btn-hero" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
