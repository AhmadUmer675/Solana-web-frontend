import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const videos = [
  {
    title: 'Solana Stories: Behind the Mash ft. PropXAI',
    duration: '12:34',
  },
  {
    title: 'Interest Capital Markets: EXPL AI',
    duration: '8:45',
  },
];

export default function HowWeBuilt() {
  return (
    <section className="relative py-24 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-emerald-500/20 blur-3xl" />

      <div className="relative container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How we built this
          </h2>
          <p className="text-gray-400">
            Hear from the builders behind the biggest projects on Solana.
          </p>
        </motion.div>

        {/* Videos */}
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
              {/* Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-cyan-500 via-purple-600 to-emerald-500">
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-sm">
                  {video.duration}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mt-4 group-hover:text-cyan-400 transition-colors">
                {video.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}