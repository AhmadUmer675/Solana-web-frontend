import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Copy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import Logo from "./../../../public/images.png";
import { useWallet } from "@/context/WalletContext";
import { getPhantomStatus, isIOSDevice } from "@/lib/wallet";

const navLinks = [
  { name: "Create Token", path: "/create-token" },
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    walletConnected, 
    walletAddress, 
    isConnecting, 
    error, 
    showWalletModal, 
    setShowWalletModal, 
    connect, 
    disconnect,
    setError
  } = useWallet();

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsDropdownOpen(false);
    }
  };

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
            <div className="hidden lg:flex relative">
              {walletConnected && walletAddress ? (
                <div className="relative">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 cursor-pointer transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title={walletAddress}
                  >
                    <Wallet className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white font-medium">
                      {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0b0f1a] border border-white/10 shadow-xl overflow-hidden z-50"
                      >
                        <button
                          onClick={handleCopyAddress}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy address
                        </button>
                        <button
                          onClick={async () => {
                            await disconnect();
                            setIsDropdownOpen(false);
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/5"
                        >
                          <LogOut className="w-4 h-4" />
                          Disconnect
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowWalletModal(true)}
                  disabled={isConnecting}
                  className="border-white/20 text-white hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Phantom'}
                </Button>
              )}
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
                  {walletConnected && walletAddress ? (
                    <div 
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700"
                      onClick={() => setShowWalletModal(true)}
                    >
                      <Wallet className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white font-medium">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowWalletModal(true)}
                      disabled={isConnecting}
                      className="w-full border border-white/20 bg-transparent text-white hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      {isConnecting ? 'Connecting...' : 'Connect Phantom'}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* CONNECT WALLET POPUP */}
      <AnimatePresence>
        {showWalletModal && (
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
                onClick={() => setShowWalletModal(false)}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X />
              </button>

              <h2 className="text-2xl font-semibold mb-6">
                {walletConnected ? 'Wallet Connected' : 'Connect a wallet on Solana to continue'}
              </h2>

              {walletConnected && walletAddress && (
                <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-gray-400">Connected</p>
                        <p className="text-sm font-medium text-white">{walletAddress}</p>
                      </div>
                    </div>
                    <button
                      onClick={disconnect}
                      className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 text-red-300 hover:text-red-200"
                  >
                    <X className="w-4 h-4 inline" />
                  </button>
                </div>
              )}

              {(() => {
                const status = getPhantomStatus();
                
                if (status.isInstalled || status.isMobile) {
                  return (
                    <div 
                      className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-3 hover:bg-black/60 cursor-pointer transition-all"
                      onClick={connect}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={Logo}
                          alt="Phantom"
                          className="w-8 h-8"
                        />
                        <span className="font-medium">
                          {status.isMobile ? 'Phantom App' : 'Phantom'}
                        </span>
                      </div>
                      <span className="text-sm text-emerald-400">
                        {status.isInstalled ? 'Detected' : 'Tap to Connect'}
                      </span>
                    </div>
                  );
                }
                
                return (
                  <div className="p-4 text-center">
                    <p className="text-gray-400 mb-4">
                      {status.isMobile 
                        ? 'Phantom app is not installed'
                        : 'Phantom wallet is not installed'}
                    </p>
                    <a
                      href={status.isMobile 
                        ? (isIOSDevice() ? 'https://apps.apple.com/app/phantom-solana-wallet/id1598432978' : 'https://play.google.com/store/apps/details?id=app.phantom')
                        : 'https://phantom.app'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      {status.isMobile ? 'Install Phantom App' : 'Install Phantom Wallet'}
                    </a>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
