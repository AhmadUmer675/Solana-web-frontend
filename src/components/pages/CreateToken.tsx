import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  Link2, 
  Shield, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Upload,
  Link as LinkIcon,
  Twitter,
  Send,
  MessageCircle,
  Headphones,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Download,
  ArrowRight
} from 'lucide-react';
import Stepper from '@/components/ui/Stepper';
import { connectPhantomWallet, getCurrentWalletAddress } from '@/services/walletService';
import { 
  getFeeTransaction, 
  signAndSendFeeTransaction,
  createtokensOnBackend,
  signAndSendtokensTransaction,
  generateMintKeypair,
  uploadToIPFS,
  getWalletBalanceSOL
} from '@/services/tokensService';
import { Keypair } from '@solana/web3.js';
import { 
  isPhantomInstalled, 
  onWalletAccountChange,
  isMobileDevice,
  openPhantomMobileApp
} from '@/lib/wallet';

interface tokensFormData {
  // Step 1: tokens Info
  tokensName: string;
  tokensSymbol: string;
  tokensLogo: File | null;
  onChainName: boolean;
  onChainSymbol: boolean;
  
  // Step 2: Supply
  tokensDecimals: number;
  totalSupply: string;
  tokensDescription: string;
  storeDescription: boolean;
  
  // Step 3: Details
  enableSocials: boolean;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  modifyCreator: boolean;
  customAddress: boolean;
  revokeFreeze: boolean;
  revokeMint: boolean;
  revokeUpdate: boolean;
}

type WalletStatus = 'checking' | 'not_installed' | 'installed_disconnected' | 'connected';

const Createtokens = () => {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('checking');
  const [currentStep, setCurrentStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [feeTxSignature, setFeeTxSignature] = useState<string | null>(null);
  const [mintKeypair, setMintKeypair] = useState<Keypair | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [txProgress, setTxProgress] = useState<
    { label: string; status: 'pending' | 'active' | 'done' | 'error' }[]
  >([
    { label: 'Preparing Transaction', status: 'pending' },
    { label: 'Confirming', status: 'pending' },
    { label: 'Processing', status: 'pending' },
    { label: 'Creating tokens', status: 'pending' },
  ]);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  type ToastType = 'info' | 'success' | 'error';
  interface ToastItem { id: number; type: ToastType; message: string }
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (type: ToastType, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  const [formData, setFormData] = useState<tokensFormData>({
    tokensName: '',
    tokensSymbol: '',
    tokensLogo: null,
    onChainName: true,
    onChainSymbol: true,
    tokensDecimals: 9,
    totalSupply: '1000000000',
    tokensDescription: '',
    storeDescription: true,
    enableSocials: true,
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    modifyCreator: true,
    customAddress: true,
    revokeFreeze: false,
    revokeMint: false,
    revokeUpdate: false,
  });

  const steps = [
    { id: 1, label: 'tokens Info', icon: <Info className="w-6 h-6" /> },
    { id: 2, label: 'Supply', icon: <Link2 className="w-6 h-6" /> },
    { id: 3, label: 'Details', icon: <Shield className="w-6 h-6" /> },
  ];

  const updateFormData = <K extends keyof tokensFormData>(field: K, value: tokensFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDecimalsChange = (delta: number) => {
    const newDecimals = Math.max(0, Math.min(18, formData.tokensDecimals + delta));
    updateFormData('tokensDecimals', newDecimals);
    
    // Recalculate total supply display if needed, but usually supply is input as base
    // Here we just keep the supply string as is
  };

  const formatSupply = (supply: string, decimals: number = 0) => {
    const num = parseFloat(supply);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
  };

  const calculateTotalCost = () => {
    let cost = 0.10; // Base fee
    if (formData.modifyCreator) cost += 0.10;
    if (formData.customAddress) cost += 0.20;
    if (formData.revokeFreeze) cost += 0.10;
    if (formData.revokeMint) cost += 0.10;
    if (formData.revokeUpdate) cost += 0.10;
    return cost.toFixed(2);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('tokensLogo', file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeLogo = () => {
    updateFormData('tokensLogo', null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  // Wallet Detection and Connection Logic
  useEffect(() => {
    const checkWalletStatus = async () => {
      // Small delay for mobile injection
      if (isMobileDevice()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (isPhantomInstalled()) {
        const address = getCurrentWalletAddress();
        if (address) {
          setWalletAddress(address);
          setWalletStatus('connected');
          try {
            const bal = await getWalletBalanceSOL(address);
            setWalletBalance(bal);
          } catch {
            setWalletBalance(null);
          }
        } else {
          setWalletStatus('installed_disconnected');
          
          // Auto-connect if inside Phantom browser (mobile or desktop)
          if (window.solana?.isPhantom) {
             try {
               const resp = await window.solana.connect({ onlyIfTrusted: true });
               if (resp.publicKey) {
                 setWalletAddress(resp.publicKey.toString());
                 setWalletStatus('connected');
                 try {
                   const bal = await getWalletBalanceSOL(resp.publicKey.toString());
                   setWalletBalance(bal);
                 } catch {
                   setWalletBalance(null);
                 }
               }
             } catch (e) {
               // Ignore eager connection errors
             }
          }
        }
      } else {
        // Not installed (or not yet injected on mobile)
        setWalletStatus('not_installed');
      }
    };

    checkWalletStatus();
    
    // Listen for account changes
    const cleanup = onWalletAccountChange((publicKey) => {
      if (publicKey) {
        setWalletAddress(publicKey);
        setWalletStatus('connected');
        getWalletBalanceSOL(publicKey).then(setWalletBalance).catch(() => {});
      } else {
        setWalletAddress(null);
        setWalletStatus(isPhantomInstalled() ? 'installed_disconnected' : 'not_installed');
      }
    });

    return () => {
      cleanup();
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Allow the wallet service to handle device detection and waiting logic
      const result = await connectPhantomWallet();
      
      if (result.success && result.wallet) {
        setWalletAddress(result.wallet);
        setWalletStatus('connected');
        try {
          const bal = await getWalletBalanceSOL(result.wallet);
          setWalletBalance(bal);
          if (bal !== null) {
            addToast('info', `Detected SOL balance: ${bal.toFixed(4)} SOL`);
          }
        } catch {
          setWalletBalance(null);
        }
      } else {
        // Only show error if it's not a redirect/mobile handling case
        if (result.error) {
           setError(result.error);
           
           // If on mobile and error indicates redirect, give visual feedback
           if (isMobileDevice() && result.isMobile) {
             addToast('info', 'Opening Phantom app. Approve the connection and return to this page.');
             setTimeout(() => setError(null), 3000); // Clear "Opening..." message after a few seconds
           }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDownloadWallet = () => {
    window.open('https://phantom.app/', '_blank');
    // After returning, user might have installed it
    // We can add a "I've installed it" button or just let them reload
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ... (Transaction logic remains similar, will be rendered in 'connected' state)


  // Generate mint keypair when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && !mintKeypair) {
      setMintKeypair(generateMintKeypair());
    }
  }, [currentStep, mintKeypair]);

  const handleCreatetokens = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      addToast('error', 'Please connect your wallet first');
      return;
    }

    if (!formData.tokensName.trim() || !formData.tokensSymbol.trim()) {
      setError('Please fill in tokens name and symbol');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setMintAddress(null);
    setTxProgress([
      { label: 'Preparing Transaction', status: 'active' },
      { label: 'Confirming', status: 'pending' },
      { label: 'Processing', status: 'pending' },
      { label: 'Creating tokens', status: 'pending' },
    ]);

    // Auto-detect SOL amount and block if insufficient
    try {
      const bal = await getWalletBalanceSOL(walletAddress);
      setWalletBalance(bal);
      if (bal !== null && bal < 0.02) {
        setError('Insufficient SOL balance (need ~0.02 SOL for rent & fees)');
        addToast('error', 'Insufficient SOL balance (need ~0.02 SOL)');
        setIsProcessing(false);
        setTxProgress([
          { label: 'Preparing Transaction', status: 'error' },
          { label: 'Confirming', status: 'pending' },
          { label: 'Processing', status: 'pending' },
          { label: 'Creating tokens', status: 'pending' },
        ]);
        return;
      }
    } catch {
      setTxProgress(prev => prev);
    }

    try {
      // Step 1: Get fee transaction if not already paid
      let signature = feeTxSignature;
      
      if (!signature) {
        setSuccess('Getting fee transaction...');
        const feeResult = await getFeeTransaction(walletAddress);
        if (feeResult.feeAmount) {
          addToast('info', `Fee required: ${feeResult.feeAmount} SOL`);
        }
        
        if (!feeResult.success || !feeResult.serializedTransaction) {
          throw new Error(feeResult.error || 'Failed to get fee transaction');
        }

        // Step 2: Sign and send fee transaction
        setSuccess('Please sign the fee transaction in Phantom...');
        const feeSignResult = await signAndSendFeeTransaction(
          feeResult.serializedTransaction
        );

        if (!feeSignResult.success || !feeSignResult.signature) {
          addToast('error', feeSignResult.error || 'Fee transaction failed');
          throw new Error(feeSignResult.error || 'Failed to send fee transaction');
        }

        signature = feeSignResult.signature;
        setFeeTxSignature(signature);
        addToast('success', 'Fee paid successfully');
        setTxProgress([
          { label: 'Preparing Transaction', status: 'done' },
          { label: 'Confirming', status: 'active' },
          { label: 'Processing', status: 'pending' },
          { label: 'Creating tokens', status: 'pending' },
        ]);
      } else {
        addToast('info', 'Fee already paid');
      }

      // Step 3: Generate mint keypair if not already generated
      let mintKey = mintKeypair;
      if (!mintKey) {
        mintKey = generateMintKeypair();
        setMintKeypair(mintKey);
      }

      // Step 4: Upload logo to IPFS if provided
      let logoUri = null;
      if (formData.tokensLogo) {
        setSuccess('Uploading logo to IPFS...');
        const uploadResult = await uploadToIPFS(formData.tokensLogo);
        
        if (!uploadResult.success || !uploadResult.url) {
           // Fallback or warning - but proceed to create tokens without logo? 
           // Better to throw error if user expects logo
           throw new Error(uploadResult.error || 'Failed to upload logo');
        }
        logoUri = uploadResult.url;
      }

      // Step 5: Create tokens on backend with all metadata
      setSuccess('Creating tokens metadata...');
      setTxProgress([
        { label: 'Preparing Transaction', status: 'done' },
        { label: 'Confirming', status: 'done' },
        { label: 'Processing', status: 'active' },
        { label: 'Creating tokens', status: 'pending' },
      ]);
      const createResult = await createtokensOnBackend(walletAddress, {
        tokensName: formData.tokensName.trim(),
        symbol: formData.tokensSymbol.trim().toUpperCase(),
        supply: formData.totalSupply,
        decimals: formData.tokensDecimals,
        description: formData.storeDescription ? formData.tokensDescription.trim() : undefined,
        logoUri: logoUri || undefined,
        website: formData.enableSocials && formData.website ? formData.website.trim() : undefined,
        twitter: formData.enableSocials && formData.twitter ? formData.twitter.trim() : undefined,
        telegram: formData.enableSocials && formData.telegram ? formData.telegram.trim() : undefined,
        discord: formData.enableSocials && formData.discord ? formData.discord.trim() : undefined,
        feeTxSignature: signature,
        mintPublicKey: mintKey.publicKey.toBase58(),
      });

      if (!createResult.success || !createResult.serializedTransaction) {
        throw new Error(createResult.error || 'Failed to create tokens');
      }

      // Step 5: Sign and send tokens transaction
      setSuccess('Please sign the tokens creation transaction in Phantom...');
      const tokensSignResult = await signAndSendtokensTransaction(
        createResult.serializedTransaction,
        mintKey
      );

      if (!tokensSignResult.success) {
        throw new Error(tokensSignResult.error || 'Failed to send tokens transaction');
      }

      // Success!
      const mintAddr = tokensSignResult.mintAddress;
      setMintAddress(mintAddr || null);
      setSuccess(`tokens Created Successfully! Mint: ${mintAddr}`);
      addToast('success', 'tokens created successfully');
      setTxProgress([
        { label: 'Preparing Transaction', status: 'done' },
        { label: 'Confirming', status: 'done' },
        { label: 'Processing', status: 'done' },
        { label: 'Creating tokens', status: 'done' },
      ]);
      
      // Reset form after 10 seconds
      setTimeout(() => {
        setSuccess(null);
        setCurrentStep(1);
        setFormData({
          tokensName: '',
          tokensSymbol: '',
          tokensLogo: null,
          onChainName: false,
          onChainSymbol: false,
          tokensDecimals: 9,
          totalSupply: '1000000000',
          tokensDescription: '',
          storeDescription: false,
          enableSocials: false,
          website: '',
          twitter: '',
          telegram: '',
          discord: '',
          modifyCreator: false,
          customAddress: false,
          revokeFreeze: false,
          revokeMint: false,
          revokeUpdate: false,
        });
        setFeeTxSignature(null);
        setMintKeypair(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 10000);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to create tokens');
      addToast('error', msg || 'Failed to create tokens');
      setTxProgress(prev => {
        const next = [...prev];
        const i = next.findIndex(s => s.status === 'active');
        if (i >= 0) next[i] = { ...next[i], status: 'error' };
        return next;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/30 py-2 px-4 text-center text-sm text-yellow-400">
        ▲ Phantom security warnings are expected - We're working with Blowfish to resolve this
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toasts */}
        <div className="fixed top-20 right-4 z-[200] space-y-2">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`min-w-[280px] px-4 py-3 rounded-lg shadow-lg border ${
                t.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : t.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-sm">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-emerald-400 hover:text-emerald-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Wallet Connection Prompt */}
        {walletStatus === 'not_installed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-6 p-8 bg-gray-800/50 border border-purple-500/30 rounded-xl text-center"
          >
            <Download className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h2 className="text-2xl font-bold mb-4">Get Started with Solana</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              To create tokenss, you need a Solana wallet. We recommend Phantom - it's safe, easy to use, and works on all devices.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDownloadWallet}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                {isMobileDevice() ? "Install / Open Phantom" : "Download Phantom"}
              </button>
              
              {isMobileDevice() && (
                 <button
                   onClick={() => openPhantomMobileApp()}
                   className="px-8 py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all flex items-center gap-2"
                 >
                   <Wallet className="w-5 h-5" />
                   Open in Phantom App
                 </button>
              )}

              <button
                onClick={handleRefresh}
                className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                I've Installed It
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {walletStatus === 'installed_disconnected' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-6 p-8 bg-gray-800/50 border border-purple-500/30 rounded-xl text-center"
          >
            <Wallet className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-8">
              Connect your Phantom wallet to start creating your tokens.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </button>
            
            {/* Fallback for mobile users if deep link doesn't trigger automatically */}
            {isMobileDevice() && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => openPhantomMobileApp()}
                  className="text-sm text-gray-400 underline hover:text-white"
                >
                  Not opening? Open in Phantom App
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Main Card */}
        {walletStatus === 'connected' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-gray-900/90 to-black border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] p-8"
        >
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent text-center">
            Create Your Solana tokens
          </h1>
          
          {/* Connected Wallet Info */}
          <div className="text-center mb-8">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-sm text-gray-300">Connected:</span>
               <span className="text-sm font-mono text-emerald-400">
                 {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
               </span>
               <span className="text-xs text-gray-500 ml-1">(Receive Address)</span>
             </div>
             {walletBalance !== null && (
               <div className="mt-3 text-sm text-gray-400">
                 Balance: <span className="text-emerald-400 font-mono">{walletBalance.toFixed(4)} SOL</span>
               </div>
             )}
          </div>

          {/* Progress Popup */}
          <AnimatePresence>
            {(isProcessing || success || error || mintAddress) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 10, opacity: 0 }}
                  className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-[#0b0f1a] to-[#0f172a] p-6 text-white border border-purple-500/30"
                >
                  {/* Close (disabled while processing) */}
                  <button
                    onClick={() => { if (!isProcessing) { setSuccess(null); setError(null); setMintAddress(null); } }}
                    disabled={isProcessing}
                    className="absolute right-4 top-4 text-white/60 hover:text-white disabled:opacity-40"
                    title={isProcessing ? 'Processing...' : 'Close'}
                  >
                    <X />
                  </button>

                  <h3 className="text-2xl font-semibold mb-1">Creating Your tokens</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    We’re setting up your tokens on the Solana network. This process usually takes about 30 seconds.
                  </p>

                  <div className="space-y-3">
                    {txProgress.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          s.status === 'done' ? 'bg-emerald-500/20 border border-emerald-400' :
                          s.status === 'active' ? 'bg-purple-500/20 border border-purple-400 animate-pulse' :
                          s.status === 'error' ? 'bg-red-500/20 border border-red-400' :
                          'bg-gray-700 border border-gray-600'
                        }`}>
                          {s.status === 'done' ? <Check className="w-3 h-3 text-emerald-400" /> :
                           s.status === 'error' ? <X className="w-3 h-3 text-red-400" /> :
                           <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        <div className={`text-sm ${
                          s.status === 'done' ? 'text-emerald-400' :
                          s.status === 'error' ? 'text-red-400' :
                          s.status === 'active' ? 'text-purple-300' :
                          'text-gray-400'
                        }`}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Result */}
                  {mintAddress && (
                    <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                      <h4 className="text-lg font-semibold text-emerald-300 mb-1">tokens Created</h4>
                      <div className="text-sm text-gray-300">
                        <div>Mint Address: <span className="font-mono text-emerald-400">{mintAddress}</span></div>
                        <div>Symbol: <span className="font-semibold">{formData.tokensSymbol.toUpperCase()}</span> • Decimals: <span className="font-semibold">{formData.tokensDecimals}</span> • Supply: <span className="font-semibold">{formData.totalSupply}</span></div>
                        <div className="mt-2">
                          <a
                            href={`https://solscan.io/tokens/${mintAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 underline"
                          >
                            View on Solscan
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper */}
          <Stepper currentStep={currentStep} steps={steps} />

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-6">tokens Basic Information</h2>

                {/* tokens Name */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">tokens Name</label>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.onChainName}
                        onChange={(e) => updateFormData('onChainName', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      On-chain value
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.tokensName}
                    onChange={(e) => updateFormData('tokensName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Cosmic Coin"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the full name of your tokens</p>
                </div>

                {/* tokens Symbol */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-300">tokens Symbol</label>
                      <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                        Solana Official
                      </span>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.onChainSymbol}
                        onChange={(e) => updateFormData('onChainSymbol', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      On-chain identifier
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.tokensSymbol}
                    onChange={(e) => updateFormData('tokensSymbol', e.target.value.toUpperCase())}
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="CSMC"
                  />
                  <p className="text-xs text-gray-500 mt-1">Short symbol (2-5 characters) that identifies your tokens</p>
                </div>

                {/* tokens Logo */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">tokens Logo</label>
                    <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      IPFS Storage
                    </span>
                  </div>
                  
                  {previewUrl ? (
                    <div className="relative group border-2 border-purple-500/50 rounded-xl p-4 bg-gray-800/30 text-center">
                       <img 
                         src={previewUrl} 
                         alt="tokens Preview" 
                         className="w-32 h-32 mx-auto rounded-lg object-cover shadow-lg mb-4"
                       />
                       <div className="flex justify-center">
                         <button
                           onClick={removeLogo}
                           className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors flex items-center gap-2"
                         >
                           <X className="w-4 h-4" />
                           Remove Logo
                         </button>
                       </div>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 transition-colors bg-gray-800/30 group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/gif"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="text-gray-300 font-medium mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB (Recommended 500x500)</p>
                      </div>
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Your logo will be stored on IPFS and linked in your tokens's on-chain metadata</p>
                </div>

                {/* Next Button */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-6">tokens Supply Configuration</h2>

                {/* tokens Decimals */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">tokens Decimals</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecimalsChange(-1)}
                      className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={formData.tokensDecimals}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        if (val >= 0 && val <= 18) {
                          handleDecimalsChange(val - formData.tokensDecimals);
                        }
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-center focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      min="0"
                      max="18"
                    />
                    <button
                      onClick={() => handleDecimalsChange(1)}
                      className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        name="decimals"
                        checked={formData.tokensDecimals === 9}
                        onChange={() => {
                          updateFormData('tokensDecimals', 9);
                          const currentSupply = parseFloat(formData.totalSupply) || 0;
                          const multiplier = Math.pow(10, 9 - formData.tokensDecimals);
                          updateFormData('totalSupply', (currentSupply * multiplier).toString());
                        }}
                        className="w-4 h-4"
                      />
                      Solana Standard: 9
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Decimals determine the divisibility of your tokens. 9 decimals is the Solana standard for most tokenss.</p>
                </div>

                {/* Total Supply */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Total Supply</label>
                    <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Solana Official
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Based on {formData.tokensDecimals} decimals</p>
                  <input
                    type="text"
                    value={formData.totalSupply}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData('totalSupply', val);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="10000000000000"
                  />
                  <p className="text-xs text-emerald-400 mt-2">
                    Total supply with decimals: {formatSupply(formData.totalSupply, formData.tokensDecimals)} tokenss ({formatSupply(formData.totalSupply, formData.tokensDecimals).replace(/,/g, '') === '10000000000000' ? 'Ten Trillion' : 'Custom Amount'})
                  </p>
                </div>

                {/* tokens Description */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">tokens Description</label>
                  <textarea
                    value={formData.tokensDescription}
                    onChange={(e) => updateFormData('tokensDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                    placeholder="Official 1000 digital asset designed for seamless integration with the blockchain ecosystem."
                  />
                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.storeDescription}
                        onChange={(e) => updateFormData('storeDescription', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      Stored in official tokens metadata
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">This description will be stored in your tokens's on-chain metadata and displayed in wallets and explorers.</p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 rounded-xl border border-purple-500/50 text-white font-semibold hover:bg-purple-500/10 transition-all"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* tokens Details & Socials */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">tokens Details & Socials</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-400">Enable Socials</span>
                      <div
                        onClick={() => updateFormData('enableSocials', !formData.enableSocials)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.enableSocials ? 'bg-purple-600' : 'bg-gray-700'
                        } relative`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.enableSocials ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  {formData.enableSocials && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => updateFormData('website', e.target.value)}
                            placeholder="https://yourmemecoin.fun"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Twitter className="w-4 h-4 text-gray-400" />
                          <input
                            type="url"
                            value={formData.twitter}
                            onChange={(e) => updateFormData('twitter', e.target.value)}
                            placeholder="https://twitter.com/yourmemecoin"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Send className="w-4 h-4 text-gray-400" />
                          <input
                            type="url"
                            value={formData.telegram}
                            onChange={(e) => updateFormData('telegram', e.target.value)}
                            placeholder="https://t.me/yourchannel"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <input
                            type="url"
                            value={formData.discord}
                            onChange={(e) => updateFormData('discord', e.target.value)}
                            placeholder="https://discord.gg/your-server"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modify Creator Information */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Modify Creator Information</h3>
                      <p className="text-sm text-gray-400">Change the information of the creator in the metadata. By default, it is Solana tokens lab.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-emerald-400">+0.10 SOL</span>
                      <div
                        onClick={() => updateFormData('modifyCreator', !formData.modifyCreator)}
                        className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          formData.modifyCreator ? 'bg-purple-600' : 'bg-gray-700'
                        } relative`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.modifyCreator ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom tokens Address */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Custom tokens Address</h3>
                      <p className="text-sm text-gray-400">Generate a tokens with a custom address suffix (up to 4 characters).</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-emerald-400">+0.20 SOL</span>
                      <div
                        onClick={() => updateFormData('customAddress', !formData.customAddress)}
                        className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          formData.customAddress ? 'bg-purple-600' : 'bg-gray-700'
                        } relative`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.customAddress ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revoke tokens Authorities */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Revoke tokens Authorities</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Understanding authorities: When <span className="text-emerald-400">selected (checked)</span>, the authority will be permanently revoked (set to null). When <span className="text-emerald-400">unselected (unchecked)</span>, the authority will be transferred to your wallet.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Revoke Freeze */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="text-right mb-2">
                        <span className="text-xs text-emerald-400">+0.10 SOL</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
                        <X className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-center mb-2">Revoke Freeze</h4>
                      <p className="text-xs text-gray-400 text-center mb-4">Freeze Authority allows freezing tokens accounts. Revoke it to prevent tokenss from being frozen.</p>
                      <button
                        onClick={() => updateFormData('revokeFreeze', !formData.revokeFreeze)}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.revokeFreeze
                            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                            : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                        }`}
                      >
                        {formData.revokeFreeze ? 'Selected (Will Revoke)' : 'Unselected (Will Transfer)'}
                      </button>
                    </div>

                    {/* Revoke Mint */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="text-right mb-2">
                        <span className="text-xs text-emerald-400">+0.10 SOL</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
                        <Link2 className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-center mb-2">Revoke Mint</h4>
                      <p className="text-xs text-gray-400 text-center mb-4">Mint Authority allows creating more tokenss. Revoke it to make supply fixed and prevent inflation.</p>
                      <button
                        onClick={() => updateFormData('revokeMint', !formData.revokeMint)}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.revokeMint
                            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                            : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                        }`}
                      >
                        {formData.revokeMint ? 'Selected (Will Revoke)' : 'Unselected (Will Transfer)'}
                      </button>
                    </div>

                    {/* Revoke Update */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="text-right mb-2">
                        <span className="text-xs text-emerald-400">+0.10 SOL</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-center mb-2">Revoke Update</h4>
                      <p className="text-xs text-gray-400 text-center mb-4">Update Authority allows changing tokens metadata. Revoke it to make metadata permanent.</p>
                      <button
                        onClick={() => updateFormData('revokeUpdate', !formData.revokeUpdate)}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.revokeUpdate
                            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                            : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                        }`}
                      >
                        {formData.revokeUpdate ? 'Selected (Will Revoke)' : 'Unselected (Will Transfer)'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 rounded-xl border border-purple-500/50 bg-purple-600/10 text-white font-semibold hover:bg-purple-600/20 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreatetokens}
                    disabled={isProcessing || !walletAddress}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-purple-600 text-white font-semibold hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Create tokens (${calculateTotalCost()} SOL)`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Support */}
          <div className="mt-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4" />
            <span className="text-sm">24/7 Support Available</span>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default Createtokens;
