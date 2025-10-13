import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Rocket, TrendingUp, Users, DollarSign, 
  Target, Zap, Shield, ArrowRight, Star, CheckCircle 
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const stats = [
    { icon: Rocket, value: "2,500+", label: "Active Startups" },
    { icon: Users, value: "1,200+", label: "Investors" },
    { icon: DollarSign, value: "$250M+", label: "Funding Raised" },
    { icon: TrendingUp, value: "450+", label: "Success Stories" },
  ];

  const features = [
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI-powered algorithm connects startups with the right investors based on industry, stage, and funding needs."
    },
    {
      icon: Zap,
      title: "Quick Pitch",
      description: "Upload your pitch deck and get in front of investors in minutes. No lengthy applications required."
    },
    {
      icon: Shield,
      title: "Verified Network",
      description: "All investors and startups are verified to ensure authentic connections and serious opportunities."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechFlow AI",
      content: "StartupConnect helped us raise our Series A in just 3 months. The platform made it incredibly easy to connect with the right investors.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Investor, Venture Capital",
      content: "I've discovered amazing startups through this platform. The quality of founders and ideas is consistently high.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Founder, HealthTech Solutions",
      content: "The resources and guidance provided went beyond just connections. This platform truly understands the startup journey.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Startup team collaboration" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Empowering Startups to{" "}
              <span className="gradient-text">Connect, Grow & Get Funded</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate platform connecting ambitious founders with investors who believe in their vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="btn-hero text-lg px-8 py-6">
                  Join as Startup Founder
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:border-primary">
                  Join as Investor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass border-0 card-hover">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why Choose StartupConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in the startup ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass border-0 card-hover">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from founders and investors who found success on our platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass border-0">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="glass border-0 overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of founders and investors building the future together.
                </p>
                <Link to="/signup">
                  <Button size="lg" className="btn-secondary-hero text-lg px-8 py-6">
                    Create Your Free Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
