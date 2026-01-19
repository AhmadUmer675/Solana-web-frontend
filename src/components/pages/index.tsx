import { Coins, Share2, Droplets, Shield } from "lucide-react";
import KnowledgeCard from "@/components/sections/KnowledgeCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white mt-9">
      {/* Background gradient with blur effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Solana Token Knowledge Center
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Learn everything you need to know about creating, managing, and optimizing your Solana tokens
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <KnowledgeCard
            icon={<Coins className="h-6 w-6 text-white" />}
            title="Solana Coin Maker"
            description="Learn the complete process of creating your own Solana token, from designing tokenomics to deployment."
            linkText="Comprehensive Guide"
            to="/solana-coin-maker"
          />

          <KnowledgeCard
            icon={<Share2 className="h-6 w-6 text-white" />}
            title="Token Distribution Strategies"
            description="Learn effective strategies for distributing your token to build a strong community and market presence."
            comingSoon
            disabled
          />

          <KnowledgeCard
            icon={<Droplets className="h-6 w-6 text-white" />}
            title="Liquidity Management"
            description="Understand how to provide and manage liquidity for your token to ensure stable trading."
            comingSoon
            disabled
          />

          <KnowledgeCard
            icon={<Shield className="h-6 w-6 text-white" />}
            title="Token Security Best Practices"
            description="Learn how to secure your token and protect your community from common security threats."
            comingSoon
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
