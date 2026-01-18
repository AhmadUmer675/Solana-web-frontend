import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const ReadyToCreate = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-black text-white">
      {/* Neon glow background */}
      <div className="absolute inset-0" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create your own token?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of creators who have launched their own tokens on Solana.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-purple-600/50 bg-purple-600/10 text-white font-medium hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(153,69,255,0.4)]"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Start
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReadyToCreate;
