import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X } from 'lucide-react';
import Logo from './../../../public/images.png';

const ReadyToCreate = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative py-24 text-white overflow-hidden">
      {/* Base black */}
      <div className="absolute inset-0 bg-black" />

      {/* Gradient blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-cyan-500/20 to-emerald-500/20 blur-3xl" />

      <div className="relative container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create your own tokens?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of creators who have launched their own tokenss on Solana.
          </p>

          <motion.button
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-purple-500/40 bg-purple-600/10 backdrop-blur text-white font-medium hover:bg-purple-600/20 transition-all shadow-[0_0_25px_rgba(153,69,255,0.45)]"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Start
          </motion.button>
        </motion.div>
      </div>

      {/* Wallet Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-[360px] rounded-2xl bg-gradient-to-b from-[#0b0f1a] to-black border border-white/10 p-6 shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X />
              </button>

              <h3 className="text-xl font-semibold mb-6">
                Connect a wallet on <br /> Solana to continue
              </h3>

              {/* Wallet Option */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/40 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <img src={Logo} alt="" />
                  </div>
                  <span className="font-medium">Phantom</span>
                </div>
                <span className="text-sm text-gray-400">Detected</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReadyToCreate;