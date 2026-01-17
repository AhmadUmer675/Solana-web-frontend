import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/three/ParticleBackground';

const partners = [
  'Circlepay', 'VISA', 'Mastercard', 'Stripe', 'PayPal', 'Lam'
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <ParticleBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">The capital market</span>
            <br />
            <span className="text-gradient">for every asset on earth.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Solana is the only chain that redefines what's
            possible. Growing, the most liquid markets,
            the most web3 apps, and free markets, unify.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="bg-gradient-purple text-primary-foreground hover:opacity-90 px-8 shadow-glow">
              Start Building
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
              Read Docs
            </Button>
          </motion.div>

          {/* Event Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="border-gradient rounded-2xl p-1 max-w-md mx-auto mb-16"
          >
            <div className="bg-gradient-card rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-20 bg-gradient-purple rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold text-primary-foreground">BREAK</div>
                  <div className="text-xl font-black text-primary-foreground">26</div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Breakpoint 2026</div>
                <div className="text-foreground font-medium">Abu Dhabi</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60"
        >
          {partners.map((partner) => (
            <div key={partner} className="text-muted-foreground font-semibold text-lg">
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
