import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Twitter, Linkedin, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header.jsx';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  const socialLinks = [
    { icon: <Github size={20} />, href: "https://github.com/NKG-S" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/nethmin-kavindu-386978349/" },
    // Keeping Twitter as generic since no link was provided, or you can remove it
    { icon: <Twitter size={20} />, href: "#" } 
  ];

  return (
    <>
    <Header/>
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Realistic Ambient Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/40 rounded-full mix-blend-screen filter blur-[120px] animate-pulse duration-700"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse duration-1000"></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-pink-600/30 rounded-full mix-blend-screen filter blur-[80px]"></div>

      {/* Main Glass Card Container */}
      {/* Added: border-t-white/20 border-l-white/20 for light reflection source */}
      <div className="relative w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 border-t-white/20 border-l-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row z-10 transition-all duration-500">
        
        {/* Glass Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40 pointer-events-none z-20"></div>

        {/* Left Side: Contact Info */}
        <div className="w-full md:w-2/5 bg-black/20 p-10 text-white flex flex-col justify-between relative overflow-hidden z-30">
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 drop-shadow-lg">Get in Touch</h2>
            <div className="h-1 w-20 bg-purple-500 rounded-full mb-6"></div>
            <p className="text-gray-300 mb-12 leading-relaxed font-light text-lg">
              We'd love to hear from you. Let's create something amazing together.
            </p>
            
            <div className="space-y-8">
              <a href="tel:+94721663030" className="flex items-center space-x-5 group/item">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group-hover/item:scale-110 group-hover/item:bg-purple-500/20 transition-all duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-300 uppercase tracking-wider font-bold mb-1">Phone</p>
                  <p className="font-medium text-gray-100 group-hover/item:text-white transition-colors">+94 72 166 3030</p>
                </div>
              </a>

              <a href="mailto:nethminkavindu@gmail.com" className="flex items-center space-x-5 group/item">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group-hover/item:scale-110 group-hover/item:bg-purple-500/20 transition-all duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-300 uppercase tracking-wider font-bold mb-1">Email</p>
                  <p className="font-medium text-gray-100 group-hover/item:text-white transition-colors">nethminkavindu@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center space-x-5 group/item">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group-hover/item:scale-110 group-hover/item:bg-purple-500/20 transition-all duration-300">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-300 uppercase tracking-wider font-bold mb-1">Location</p>
                  <p className="font-medium text-gray-100 group-hover/item:text-white transition-colors leading-tight">
                    University of Colombo,<br/>Colombo, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex space-x-4 relative z-10">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-purple-900 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/10"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-3/5 p-10 bg-black/10 relative z-30">
          <h3 className="text-3xl font-semibold text-white mb-8 drop-shadow-md">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:bg-black/30 focus:border-purple-400/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 peer"
                placeholder="Name"
              />
              <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all duration-300 -translate-y-8 scale-90 bg-transparent px-1 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-purple-300 cursor-text">
                Your Name
              </label>
            </div>

            <div className="group relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:bg-black/30 focus:border-purple-400/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 peer"
                placeholder="Email"
              />
              <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all duration-300 -translate-y-8 scale-90 bg-transparent px-1 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-purple-300 cursor-text">
                Email Address
              </label>
            </div>

            <div className="group relative">
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-transparent focus:outline-none focus:bg-black/30 focus:border-purple-400/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 peer resize-none"
                placeholder="Message"
              ></textarea>
              <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all duration-300 -translate-y-8 scale-90 bg-transparent px-1 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-90 peer-focus:text-purple-300 cursor-text">
                Write your message...
              </label>
            </div>

            <div className="flex items-center justify-end pt-4">
               <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative overflow-hidden rounded-2xl px-10 py-4 font-bold text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                  isSubmitted ? 'bg-green-500/80 backdrop-blur-sm cursor-default' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitted ? (
                    <>
                      <span>Sent Successfully</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Send Message</span>
                      <Send 
                        className={`w-5 h-5 transition-transform duration-500 ${
                          isHovered ? 'translate-x-1 -translate-y-1' : ''
                        }`} 
                      />
                    </>
                  )}
                </span>
                
                {/* Glossy Shine on Button */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-white/20 text-[10px] font-light tracking-[0.2em] uppercase mix-blend-overlay">
        Designed with React & Tailwind
      </div>
    </div>
    </>
  );
}