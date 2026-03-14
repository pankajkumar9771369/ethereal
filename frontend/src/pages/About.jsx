import React from 'react';
import { Leaf, Droplet, Sparkles, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-cream min-h-screen text-slate pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-sage/20 flex items-center text-center px-4">
        <div className="absolute inset-0 bg-stone-900/10 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-widest mb-6">Our Philosophy</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed text-slate/80">
            Ethereal Skincare believes in the profound harmony between nature and science. 
            We craft luxurious, efficacious botanical formulations that transform not just your skin, but your daily rituals.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop" 
              alt="Natural ingredients" 
              className="w-full h-[600px] object-cover"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-light uppercase tracking-widest">The Origins of Ethereal</h2>
            <div className="h-px bg-slate/20 w-24"></div>
            <p className="font-light leading-relaxed text-slate/80">
              Born from a desire to strip away the synthetic and embrace the pure, Ethereal began in a small apothecary in 2026. 
              Our founders, a team of botanists and holistic estheticians, sought out rare flora known for their potent healing properties.
            </p>
            <p className="font-light leading-relaxed text-slate/80">
              We source our ingredients globally but sustainably, ensuring that every drop of serum and every scoop of cream 
              respects the earth it came from while delivering unparalleled clinical results.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light uppercase tracking-widest mb-4">Our Core Values</h2>
            <p className="font-light text-slate/70">What drives every formulation we create.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-primary">
                <Leaf size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-medium tracking-widest uppercase text-sm">100% Vegan</h3>
              <p className="font-light text-sm text-slate/70">Cruelty-free and formulated without any animal-derived ingredients.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-primary">
                <Droplet size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-medium tracking-widest uppercase text-sm">Pure Actives</h3>
              <p className="font-light text-sm text-slate/70">High-concentration botanical extracts for maximum efficacy without fillers.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-primary">
                <Sparkles size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-medium tracking-widest uppercase text-sm">Clean Science</h3>
              <p className="font-light text-sm text-slate/70">Free from parabens, sulfates, synthetic fragrances, and harmful chemicals.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center text-primary">
                <Heart size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-medium tracking-widest uppercase text-sm">Ethical Sourcing</h3>
              <p className="font-light text-sm text-slate/70">Ingredients harvested with profound respect for communities and ecosystems.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AboutPage;
