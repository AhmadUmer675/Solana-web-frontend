import { Headphones } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black text-white py-10 overflow-hidden">
      {/* Top subtle border */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />

      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
        {/* Support */}
        <div className="flex items-center gap-2 text-white/70">
          <Headphones className="h-4 w-4" />
          <span className="text-sm">24/7 Support Available</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/50 text-center">
          © 2026 Solana Token Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;