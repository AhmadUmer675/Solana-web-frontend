import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import Logo from "./../../../public/images.png";

const navLinks = [
  { name: "Create Token", path: "/" },
  {
    name: "Create Liquidity",
    external: true,
    href: "https://raydium.io/liquidity-pools/",
  },
  {
    name: "Manage Liquidity",
    external: true,
    href: "https://raydium.io/portfolio/",
  },
  { name: "Learn", path: "/learn" },
  { name: "Trending Tokens", path: "/trending", isNew: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (link: any) => {
    setIsOpen(false);
    if (link.external) {
      window.open(link.href, "_blank");
    } else {
      navigate(link.path);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer text-xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent"
            >
              Solana Token Labs
            </span>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link)}
                  className="relative px-4 py-2 text-sm text-white/80 hover:text-white transition"
                >
                  {link.name}
                  {link.isNew && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] bg-emerald-500 rounded-full">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Button */}
            <div className="hidden lg:flex">
              <Button
                variant="outline"
                onClick={() => setShowWallet(true)}
                className="border-white/20 text-white hover:border-emerald-500 hover:bg-emerald-500/10"
              >
                Connect Phantom
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-white/10 py-4"
              >
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link)}
                    className="flex w-full justify-between px-4 py-3 text-white/80 hover:text-white"
                  >
                    {link.name}
                    {link.isNew && (
                      <span className="text-[10px] bg-emerald-500 px-2 rounded-full">
                        NEW
                      </span>
                    )}
                  </button>
                ))}

                <div className="px-4 pt-4">
                  <Button
                    onClick={() => setShowWallet(true)}
                    className="w-full border border-white/20 bg-transparent text-white hover:bg-emerald-500/10"
                  >
                    Connect Phantom
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* CONNECT WALLET POPUP */}
      <AnimatePresence>
        {showWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-[#0b0f1a] to-[#0f172a] p-6 text-white"
            >
              {/* Close */}
              <button
                onClick={() => setShowWallet(false)}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X />
              </button>

              <h2 className="text-2xl font-semibold mb-6">
                Connect a wallet on Solana to continue
              </h2>

              <div className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-3 hover:bg-black/60 cursor-pointer">
                <div className="flex items-center gap-3">
                  <img
                    src={Logo}
                    alt="Phantom"
                    className="w-8 h-8"
                  />
                  <span className="font-medium">Phantom</span>
                </div>
                <span className="text-sm text-emerald-400">Detected</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}