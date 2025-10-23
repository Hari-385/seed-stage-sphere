import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, ExternalLink, BookOpen, Video, FileText, Award } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Startup Funding Guide",
      category: "Guide",
      description: "Complete guide to understanding different funding stages, from seed to Series C.",
      color: "from-primary to-primary-glow",
      filePath: "/resources/Startup_Funding_Guide.pdf"
    },
    {
      icon: FileText,
      title: "Pitch Deck Template",
      category: "Template",
      description: "Professional pitch deck template used by successful startups to raise millions.",
      color: "from-secondary to-[hsl(340,80%,65%)]",
      filePath: "/resources/Pitch_Deck_Template.pdf"
    },
    {
      icon: Award,
      title: "Government Startup Schemes",
      category: "Resource",
      description: "Comprehensive list of government programs and schemes supporting startups.",
      color: "from-green-500 to-emerald-500",
      filePath: "/resources/Guidelines_for_Startup_India_Seed_Fund_Scheme.pdf"
    },
    {
      icon: BookOpen,
      title: "Market Research Framework",
      category: "Guide",
      description: "Step-by-step framework for conducting effective market research for your startup.",
      color: "from-purple-500 to-pink-500",
      filePath: "/resources/Market_Research_Framework.pdf"
    }
  ];

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Startup <span className="gradient-text">Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access guides, templates, and learning materials to help you succeed
            </p>
          </div>

          {/* Featured Resource */}
          <Card className="glass border-0 mb-12 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12">
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    Featured Resource
                  </div>
                  <h2 className="text-3xl font-bold mb-4">The Complete Fundraising Playbook</h2>
                  <p className="text-muted-foreground mb-6">
                    A comprehensive 50-page guide covering everything from preparing your startup for funding to closing the deal. Includes real examples from successful fundraising campaigns.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      className="btn-hero gap-2"
                      onClick={() => handleDownload('/resources/The_Complete_Fundraising_Playbook.pdf', 'The_Complete_Fundraising_Playbook.pdf')}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handlePreview('/resources/The_Complete_Fundraising_Playbook.pdf')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Preview
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-12">
                  <BookOpen className="w-48 h-48 text-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {resources.map((resource, index) => (
              <Card key={index} className="glass border-0 card-hover group">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <resource.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardDescription className="text-xs uppercase font-semibold">
                      {resource.category}
                    </CardDescription>
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {resource.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleDownload(resource.filePath, resource.title + '.pdf')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handlePreview(resource.filePath)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="glass border-0 text-center p-6 cursor-pointer hover:scale-105 transition-transform">
              <FileText className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Guides</h3>
              <p className="text-sm text-muted-foreground">24 resources</p>
            </Card>
            <Card className="glass border-0 text-center p-6 cursor-pointer hover:scale-105 transition-transform">
              <Video className="w-8 h-8 mx-auto mb-3 text-secondary" />
              <h3 className="font-semibold mb-1">Videos</h3>
              <p className="text-sm text-muted-foreground">16 resources</p>
            </Card>
            <Card className="glass border-0 text-center p-6 cursor-pointer hover:scale-105 transition-transform">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-1">Templates</h3>
              <p className="text-sm text-muted-foreground">12 resources</p>
            </Card>
            <Card className="glass border-0 text-center p-6 cursor-pointer hover:scale-105 transition-transform">
              <Award className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-1">Programs</h3>
              <p className="text-sm text-muted-foreground">8 resources</p>
            </Card>
          </div>

          {/* CTA */}
          <Card className="glass border-0 text-center">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our community forum to connect with other founders and get personalized advice from experts.
              </p>
              <Button className="btn-secondary-hero gap-2">
                <ExternalLink className="w-4 h-4" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
