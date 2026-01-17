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
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-solana-purple/10 to-background" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-solana-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-solana-green/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Build alongside<br />
            <span className="text-gradient">our global community.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're a dev, artist, or creator, join millions of others in Solana Discord to be part of crypto's future.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-gradient rounded-xl p-6 bg-gradient-card text-center group hover:shadow-glow transition-shadow"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
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
              className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">{link.name[0]}</span>
              </div>
              <div>
                <div className="text-foreground font-medium group-hover:text-primary transition-colors">
                  {link.name}
                </div>
                <div className="text-muted-foreground text-sm">{link.handle}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
