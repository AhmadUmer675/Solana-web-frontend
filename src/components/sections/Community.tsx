import { motion } from 'framer-motion';
import { MessageSquare, Users, Code, Globe } from 'lucide-react';

const communityStats = [
  { icon: MessageSquare, value: '11.5M', label: 'Discord members' },
  { icon: Users, value: '3M+', label: 'Twitter/X followers' },
  { icon: Code, value: '2,500+', label: 'Core contributors' },
  { icon: Globe, value: '140+', label: 'Countries reached' },
];

const socialLinks = [
  { name: 'Discord', handle: 'Join 11.5M members' },
  { name: 'Twitter', handle: 'Follow @solana' },
  { name: 'GitHub', handle: 'Star our repos' },
  { name: 'YouTube', handle: 'Subscribe for updates' },
];

export default function Community() {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Soft glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Build alongside <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              our global community.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Whether you're a dev, artist, or creator, join millions of others in
            Solana Discord to help shape the future of crypto.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl p-6 bg-white/5 border border-white/10 text-center hover:border-purple-500/40 transition-all group"
            >
              <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-4"
        >
          {socialLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-bold">
                  {link.name[0]}
                </span>
              </div>
              <div>
                <div className="font-medium group-hover:text-cyan-400 transition-colors">
                  {link.name}
                </div>
                <div className="text-gray-400 text-sm">{link.handle}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
