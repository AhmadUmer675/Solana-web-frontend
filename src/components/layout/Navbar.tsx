import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Create Token', href: '#' },
  { name: 'Create Liquidity', href: '#' },
  { name: 'Manage Liquidity', href: '#' },
  { name: 'Learn', href: '#' },
  { name: 'Trending Tokens', href: '#', isNew: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
              Solana Token Labs
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                {link.name}
                {link.isNew && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                    NEW
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Connect Button */}
          <div className="hidden lg:flex items-center">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all"
            >
              Connect Phantom
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-white/10 bg-black"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center justify-between w-full px-4 py-3 text-white/80 hover:text-white transition-colors"
              >
                <span>{link.name}</span>
                {link.isNew && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                    NEW
                  </span>
                )}
              </a>
            ))}

            <div className="px-4 pt-4">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:border-emerald-500 hover:bg-emerald-500/10"
              >
                Connect Phantom
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
