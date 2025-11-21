import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, Zap, Shield, Package, TrendingUp, Star, Users, Rocket, ArrowRight, Check, Quote } from "lucide-react";

function Hero() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Dynamic gradient that follows mouse */}
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`
        }}
      ></div>

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Floating orbs with different animations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-full px-5 py-2.5 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              New Collection 2025 - Limited Edition
            </span>
          </div>

          {/* Main heading with stagger animation */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-fade-in">Redefine</span>
            <br />
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in" style={{animationDelay: '0.2s'}}>
              Your Style
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Elevate your lifestyle with premium products designed for the future. 
            <span className="block mt-2 text-indigo-300 font-semibold">Experience innovation meets elegance.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/product')}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/50 transition-all transform hover:scale-105 hover:shadow-indigo-500/70 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <Rocket className="w-5 h-5" />
              <span>Explore Now</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border-2 border-white/10 hover:border-indigo-500/50 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all"
            >
              <span>Learn More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-indigo-400/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xs text-gray-500 font-medium">Scroll to explore</span>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience instant checkout and blazing-fast delivery to your doorstep.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level encryption ensures your transactions are always protected.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Package,
      title: "Premium Quality",
      description: "Handpicked products that meet the highest standards of excellence.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing with exclusive deals and seasonal discounts.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div id="features" className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-indigo-400 text-sm font-semibold">WHY CHOOSE US</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Built for the
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Future</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We combine cutting-edge technology with exceptional service to deliver an unmatched shopping experience.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6`}>
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>

              {/* Hover arrow */}
              <ArrowRight className="w-5 h-5 text-indigo-400 mt-4 transform translate-x-0 group-hover:translate-x-2 transition-transform opacity-0 group-hover:opacity-100" />
            </div>
            
          ))}
        </div>
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/product')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CTA() {
  const navigate = useNavigate();
  
  return (
    <div className="relative py-24 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Ready to Transform Your
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Shopping Experience?
          </span>
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Join thousands of satisfied customers and discover premium products today.
        </p>
        <button 
          onClick={() => navigate('/product')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/50 transition-all transform hover:scale-105"
        >
          <Rocket className="w-5 h-5" />
          Start Shopping Now
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pt-16">
        <Hero />
        <Features />
        <CTA />
      </div>
    </div>
  );
}