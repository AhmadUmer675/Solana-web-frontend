import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const videos = [
  {
    title: 'Solana Stories: Behind the Mash ft. PropXAI',
    thumbnail: 'gradient-1',
    duration: '12:34',
  },
  {
    title: 'Interest Capital Markets: EXPL AI',
    thumbnail: 'gradient-2',
    duration: '8:45',
  },
];

export default function HowWeBuilt() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How we built this
          </h2>
          <p className="text-muted-foreground">
            Hear from the builders behind the biggest projects on Solana.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className={`relative rounded-2xl overflow-hidden aspect-video ${
                index === 0 
                  ? 'bg-gradient-to-br from-solana-purple via-solana-blue to-solana-green'
                  : 'bg-gradient-to-br from-solana-pink via-solana-purple to-solana-blue'
              }`}>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-elevated">
                    <Play className="w-6 h-6 text-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 px-2 py-1 bg-background/80 rounded text-sm text-foreground backdrop-blur-sm">
                  {video.duration}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mt-4 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
