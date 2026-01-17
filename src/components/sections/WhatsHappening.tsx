import { motion } from 'framer-motion';
import { ExternalLink, MessageCircle, Repeat2, Heart } from 'lucide-react';

const feeds = [
  {
    type: 'twitter',
    author: '@solana',
    content: 'Memecoins are thriving on Solana! @Cala_Finance is bringing institutional-grade derivatives to memecoin trading.',
    time: '2h',
  },
  {
    type: 'twitter',
    author: '@SolanaFloor',
    content: 'Over 1M+ active wallets using Solana mobile apps daily. The future of mobile web3 is here.',
    time: '4h',
  },
  {
    type: 'news',
    author: 'CoinDesk',
    content: 'Solana crosses $50B in total trading volume for the month, setting new records in DeFi.',
    time: '6h',
  },
];

const categories = ['Explore', 'Delegate SOL', 'DeFi'];

export default function WhatsHappening() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            What's happening
          </h2>
          <p className="text-muted-foreground text-xl mt-2">right now</p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat, index) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          {feeds.map((feed, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-gradient rounded-xl p-4 bg-gradient-card hover:shadow-glow transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-medium">{feed.author}</span>
                    <span className="text-muted-foreground text-sm">· {feed.time}</span>
                  </div>
                  <p className="text-foreground">{feed.content}</p>
                  
                  {feed.type === 'twitter' && (
                    <div className="flex items-center gap-6 mt-4 text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Reply</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-accent transition-colors">
                        <Repeat2 className="w-4 h-4" />
                        <span className="text-sm">Repost</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-solana-pink transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Like</span>
                      </button>
                    </div>
                  )}
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
