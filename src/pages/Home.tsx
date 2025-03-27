
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Calendar, 
  ListChecks, 
  Users, 
  ChevronRight,
  Star
} from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import GlassCard from "@/components/GlassCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Animation for hero section
    const animateHero = () => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.classList.add('animate-slideUp');
      }
    };

    animateHero();
  }, []);

  const features = [
    {
      icon: Activity,
      title: "PCOS Risk Predictor",
      description: "Assess your potential PCOS risk factors with our AI-powered tool.",
      path: "/pcos-predictor"
    },
    {
      icon: Calendar,
      title: "Cycle Tracker",
      description: "Track your menstrual cycle and receive personalized predictions.",
      path: "/cycle-tracker"
    },
    {
      icon: ListChecks,
      title: "Health Recommendations",
      description: "Get tailored diet, exercise, and wellness recommendations.",
      path: "/recommendations"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with others, share experiences, and find support.",
      path: "/community"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-health-100 to-health-50 opacity-50 z-0" />
        
        {/* Pink circle decoration */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-health-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-health-300 rounded-full blur-3xl opacity-10" />
        
        <div className="container mx-auto px-6 z-10">
          <div className="hero-content max-w-3xl mx-auto text-center ">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-health-900">
              Empowering Women Through Health Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Bloom helps you understand your body better with personalized tracking,
              predictions, and health recommendations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={scrollToFeatures}
                className="btn-primary text-base font-medium flex items-center justify-center"
              >
                Explore Features
                <ChevronRight className="ml-1 w-4 h-4" />
              </button>
              <Link 
                to="/pcos-predictor" 
                className="btn-secondary text-base font-medium"
              >
                Try PCOS Predictor
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center">
              <GlassCard className="p-4 md:p-6 max-w-md">
                <div className="flex items-center text-health-700 mb-2">
                  <Star className="w-5 h-5 fill-health-400 text-health-400 mr-1" />
                  <Star className="w-5 h-5 fill-health-400 text-health-400 mr-1" />
                  <Star className="w-5 h-5 fill-health-400 text-health-400 mr-1" />
                  <Star className="w-5 h-5 fill-health-400 text-health-400 mr-1" />
                  <Star className="w-5 h-5 fill-health-400 text-health-400" />
                </div>
                <p className="text-sm md:text-base italic text-foreground/80">
                  "Try our femmeCare, which will change your whole life"
                </p>
                <div className="mt-3 text-right">
                  <p className="text-sm font-medium">Shajitha S</p>
                  <p className="text-xs text-muted-foreground">Femme Dev</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToFeatures} aria-label="Scroll down">
            <ChevronRight className="w-6 h-6 transform rotate-90 text-health-700" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-health-50 opacity-70 z-0" />
        
        <div className="container mx-auto z-10 relative">
          <div className="text-center mb-16">
            <h2 className="staggered-item text-3xl md:text-4xl font-bold mb-4 text-health-900">
              Our Features
            </h2>
            <p className="staggered-item max-w-2xl mx-auto text-muted-foreground">
              Discover tools designed to help you track, understand, and improve your health
              with personalized insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => navigate(feature.path)}
                className="hover:bg-white/90"
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-health-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="staggered-item text-3xl md:text-4xl font-bold mb-4 text-health-900">
              How It Works
            </h2>
            <p className="staggered-item max-w-2xl mx-auto text-muted-foreground">
              Our simple process helps you gain insights about your health with minimal effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Input Your Data",
                description: "Enter your health information securely in our easy-to-use interface."
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI analyzes your data to generate personalized insights and predictions."
              },
              {
                step: "3",
                title: "Get Recommendations",
                description: "Receive tailored recommendations to improve your health and wellbeing."
              }
            ].map((item, index) => (
              <div key={index} className="staggered-item flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-health-400 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-health-200 to-health-100 opacity-50" />
        
        <div className="container mx-auto z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="staggered-item text-3xl md:text-4xl font-bold mb-4 text-health-900">
              Ready to Take Control of Your Health?
            </h2>
            <p className="staggered-item text-lg mb-8 text-foreground/80">
              Start your journey with Bloom today and discover personalized insights
              for your unique health needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/pcos-predictor" 
                className="btn-primary text-base font-medium"
              >
                Try PCOS Predictor
              </Link>
              <Link 
                to="/cycle-tracker" 
                className="btn-secondary text-base font-medium"
              >
                Track Your Cycle
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
