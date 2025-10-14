import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Filter, Rocket, Heart, Eye, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Startup {
  id: string;
  name: string;
  logo: string;
  domain: string;
  stage: string;
  funding: string;
  description: string;
  tags: string[];
}

const BrowseStartups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [savedStartupIds, setSavedStartupIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchStartups();
    if (user) {
      fetchSavedStartups();
    }
  }, [user]);

  const fetchStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast({
        title: "Error",
        description: "Failed to load startups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedStartups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_startups')
        .select('startup_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedStartupIds(new Set(data?.map(item => item.startup_id) || []));
    } catch (error) {
      console.error('Error fetching saved startups:', error);
    }
  };

  const toggleSaveStartup = async (startupId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save startups",
        variant: "destructive",
      });
      return;
    }

    try {
      const isSaved = savedStartupIds.has(startupId);

      if (isSaved) {
        const { error } = await supabase
          .from('saved_startups')
          .delete()
          .eq('user_id', user.id)
          .eq('startup_id', startupId);

        if (error) throw error;

        setSavedStartupIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(startupId);
          return newSet;
        });

        toast({
          title: "Removed",
          description: "Startup removed from saved list",
        });
      } else {
        const { error } = await supabase
          .from('saved_startups')
          .insert({ user_id: user.id, startup_id: startupId });

        if (error) throw error;

        setSavedStartupIds(prev => new Set([...prev, startupId]));

        toast({
          title: "Saved",
          description: "Startup added to your saved list",
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to update saved startups",
        variant: "destructive",
      });
    }
  };

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Discover <span className="gradient-text">Innovative Startups</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through curated startups looking for investment and partnerships
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search startups by name, domain, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button variant="outline" className="gap-2 h-12">
              <Filter className="w-5 h-5" />
              Filters
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              All Startups
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              AI/ML
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              HealthTech
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              FinTech
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              EdTech
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              CleanTech
            </Badge>
          </div>

          {/* Startup Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Loading startups...
              </div>
            ) : filteredStartups.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No startups found matching your search
              </div>
            ) : (
              filteredStartups.map((startup) => (
                <Card key={startup.id} className="glass border-0 card-hover group">
                  <CardContent className="p-6">
                    {/* Logo and Save Button */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                        {startup.logo}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => toggleSaveStartup(startup.id)}
                      >
                        <Heart className={`w-5 h-5 ${savedStartupIds.has(startup.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>

                    {/* Startup Info */}
                    <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Badge variant="secondary">{startup.domain}</Badge>
                      <Badge variant="outline">{startup.stage}</Badge>
                      <Badge className="bg-green-500">{startup.funding}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {startup.description}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {startup.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="btn-hero flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="gap-2">
              <Rocket className="w-5 h-5" />
              Load More Startups
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrowseStartups;
