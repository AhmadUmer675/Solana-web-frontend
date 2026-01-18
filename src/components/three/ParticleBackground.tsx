import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/three/ParticleBackground';

const partners = ['Circlepay', 'VISA', 'Mastercard', 'Stripe', 'PayPal', 'Lam'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-black text-white">
      
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue/60 via-blue/30 to-blue/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400">
              The capital market
            </span>
            <br />
            <span className="text-white/90">for every asset on earth.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            Solana is the only chain that redefines what's possible — 
            growing the most liquid markets, the most web3 apps, and free markets, unified.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400 text-black px-8 shadow-lg hover:opacity-90 transition">
                Start Building <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 transition">
                Read Docs
              </Button>
            </motion.div>
          </motion.div>

          {/* Event Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="border border-white/20 rounded-2xl p-1 max-w-md mx-auto mb-16"
          >
            <div className="bg-black/80 rounded-xl p-4 flex items-center gap-4 border border-white/10">
              <div className="w-16 h-20 bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold text-black">BREAK</div>
                  <div className="text-xl font-black text-black">26</div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm text-white/70">Breakpoint 2026</div>
                <div className="text-white font-medium">Abu Dhabi</div>
              </div>
            </div>
          </motion.div>

          {/* Partner Logos */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70"
          >
            {partners.map((partner) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-blue font-semibold text-lg"
              >
                {partner}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
