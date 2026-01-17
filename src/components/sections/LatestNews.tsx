import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const statsCards = [
  { label: 'Approx TPS', value: '1295' },
  { label: 'Avg Confirmation Time', value: '0.4s' },
];

const comparisonData = [
  { network: 'Solana', tps: '77', time: '3 to 5 minutes' },
  { network: 'Ethereum', tps: '81', time: '~1 minute' },
  { network: 'Bitcoin', tps: '14', time: '5 minutes' },
];

export default function LatestNews() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-solana-purple/20 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            the latest on <span className="text-gradient">Solana</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border-gradient rounded-2xl p-6 bg-gradient-card"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-secondary rounded-xl p-4">
                  <div className="text-muted-foreground text-sm mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                >
                  <span className="text-muted-foreground">{row.network}</span>
                  <span className="text-foreground font-medium">{row.tps}</span>
                  <span className="text-muted-foreground text-sm">{row.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* News Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border-gradient rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="h-48 bg-gradient-to-br from-solana-purple/30 to-solana-blue/30 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center animate-pulse-slow">
                  <div className="w-12 h-12 rounded-full bg-accent/40" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-card">
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Solving Liquidity Fragmentation: How Legacy Mesh and Solana Unified $70B in Global USDT
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                A deep dive into how Solana's infrastructure is enabling seamless cross-border payments at scale.
              </p>
              <div className="flex items-center gap-2 text-primary">
                <span className="text-sm font-medium">Read more</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
