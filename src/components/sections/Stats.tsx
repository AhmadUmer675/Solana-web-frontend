import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const stats = [
  { value: '$410,758,965', label: 'Total value locked', suffix: '.33' },
  { value: '9,897', label: 'Active validators' },
];

const bottomStats = [
  { value: '50M', label: 'Monthly active users' },
  { value: '3.6B', label: 'Transactions per day' },
  { value: '$3.3T', label: 'Total trading volume' },
  { value: '$0.4B', label: 'Network fees (annual)' },
];

export default function Stats() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Purple glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solana-purple/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The fastest growing &<br />
              leading financial platform
            </h2>
            <p className="text-muted-foreground">
              These metrics are live. The fastest network for developers, with the
              most users. The most liquid markets, the most
              liquid crypto market. Start Building.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="border-gradient rounded-xl p-6 bg-gradient-card">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Real-time data</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                  {stat.suffix && <span className="text-muted-foreground">{stat.suffix}</span>}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {bottomStats.map((stat, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
