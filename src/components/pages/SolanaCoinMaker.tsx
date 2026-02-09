import {
  ArrowLeft,
  Check,
  ExternalLink,
  AlertCircle,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SolanaCoinMaker = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white">
      <button
        onClick={() => navigate("/learn")}
        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Learn Center
      </button>
      {/* Gradient + Blur Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/learn")}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learn Center
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
            <BookOpen className="h-4 w-4" />
            Comprehensive Guide
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Solana Coin Maker: Complete Guide
          </h1>

          <p className="text-white/80 text-lg">
            A step-by-step guide to creating and launching your own Solana tokens
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            {[
              "What is a Solana tokens?",
              "Why Use Solana for tokens Creation?",
              "Step-by-Step Guide to Creating Your tokens",
              "Designing tokens Economics",
              "Key Concepts of Solana tokensomics",
              "Deploying Your tokens",
              "Ready to Create Your Solana tokens?",
              "What Happens After You've Created Your tokens?",
              "Listing Your Solana tokens: Step-by-Step",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-white/70 hover:text-white transition cursor-pointer"
              >
                <span className="text-purple-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">
              What is a Solana tokens?
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              A Solana tokens is a digital asset built on the Solana blockchain
              using the SPL tokens standard.
            </p>
            <p className="text-white/80 leading-relaxed">
              Solana offers extremely low fees and high transaction speed
              compared to other blockchains.
            </p>
          </section>

          {/* Advantages */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Why Use Solana for tokens Creation?
            </h2>

            <div className="space-y-3">
              {[
                { title: "Low Fees", desc: "Almost zero transaction cost" },
                { title: "High Speed", desc: "Up to 65,000 TPS" },
                { title: "Growing Ecosystem", desc: "DeFi & NFT ready" },
                { title: "Easy Integration", desc: "Developer-friendly tools" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10"
                >
                  <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pro Tip */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur-lg">
            <div className="flex gap-3">
              <Lightbulb className="h-6 w-6 text-purple-400" />
              <div>
                <h3 className="font-semibold text-purple-400 mb-2">Pro Tip</h3>
                <p className="text-white/80 text-sm">
                  Always test your tokens on Solana devnet before deploying to
                  mainnet.
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">
                  Important Notice
                </h3>
                <p className="text-white/80 text-sm">
                  tokens creation may have legal implications. Always consult a
                  legal expert.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <section className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Create Your tokens?
            </h2>
            <p className="text-white/70 mb-6">
              Start building your Solana tokens today.
            </p>
            <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition">
              Get Started
              <ExternalLink className="h-4 w-4" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SolanaCoinMaker;
