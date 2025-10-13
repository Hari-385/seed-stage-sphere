import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Filter, Rocket, Heart, Eye, MessageSquare } from "lucide-react";

const BrowseStartups = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const startups = [
    {
      name: "TechFlow AI",
      logo: "🤖",
      domain: "AI/ML",
      stage: "Series A",
      funding: "$500K",
      description: "AI-powered project management platform with predictive analytics and smart automation for modern teams.",
      tags: ["AI", "SaaS", "Productivity"]
    },
    {
      name: "HealthSync",
      logo: "🏥",
      domain: "HealthTech",
      stage: "Series B",
      funding: "$1M",
      description: "Revolutionary telemedicine platform connecting patients with specialists through AI-powered diagnosis.",
      tags: ["HealthTech", "Telemedicine", "AI"]
    },
    {
      name: "GreenEnergy Solutions",
      logo: "🌱",
      domain: "CleanTech",
      stage: "Seed",
      funding: "$750K",
      description: "Sustainable energy solutions for residential and commercial properties with smart monitoring.",
      tags: ["CleanTech", "Energy", "IoT"]
    },
    {
      name: "FinTrack Pro",
      logo: "💰",
      domain: "FinTech",
      stage: "Series A",
      funding: "$2M",
      description: "Next-generation financial tracking and investment platform for modern investors.",
      tags: ["FinTech", "Investment", "SaaS"]
    },
    {
      name: "EduLearn AI",
      logo: "📚",
      domain: "EdTech",
      stage: "Seed",
      funding: "$300K",
      description: "Personalized learning platform powered by AI that adapts to each student's learning style.",
      tags: ["EdTech", "AI", "Learning"]
    },
    {
      name: "FoodHub Connect",
      logo: "🍔",
      domain: "FoodTech",
      stage: "Pre-Seed",
      funding: "$150K",
      description: "Connecting local food producers with restaurants through an intelligent supply chain platform.",
      tags: ["FoodTech", "Marketplace", "Logistics"]
    }
  ];

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
            {startups.map((startup, index) => (
              <Card key={index} className="glass border-0 card-hover group">
                <CardContent className="p-6">
                  {/* Logo and Save Button */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl">
                      {startup.logo}
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-5 h-5" />
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
            ))}
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
