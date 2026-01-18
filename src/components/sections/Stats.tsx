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
    <section className="relative py-24 bg-black text-white overflow-hidden">

      {/* Subtle Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Top Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              The fastest growing &<br />
              leading financial platform
            </h2>
            <p className="text-white/70">
              These metrics are live. The fastest network for developers, with the
              most users and the most liquid markets in crypto.
              Start building today.
            </p>
          </motion.div>

          {/* Highlight Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl p-[1px] bg-gradient-to-r from-purple-500 to-cyan-500"
              >
                <div className="bg-black rounded-xl p-6">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Real-time data</span>
                  </div>

                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-white/60">{stat.suffix}</span>
                    )}
                  </div>

                  <div className="text-white/60 text-sm">
                    {stat.label}
                  </div>
                </div>
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
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
