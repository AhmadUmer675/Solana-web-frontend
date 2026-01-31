import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  connectPhantomWallet, 
  disconnectPhantomWallet 
} from "@/services/walletService";
import { 
  getCurrentWalletAddress, 
  isPhantomInstalled, 
  onWalletAccountChange,
  isMobileDevice,
  getPhantomStatus,
  openPhantomMobileApp
} from "@/lib/wallet";

interface WalletContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  error: string | null;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setError: (error: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Check wallet connection on mount and auto-connect
  useEffect(() => {
    const checkAndConnect = async () => {
      // First check if already connected
      const address = getCurrentWalletAddress();
      if (address) {
        setWalletAddress(address);
        setWalletConnected(true);
        // Also register with backend
        try {
          await connectPhantomWallet();
        } catch (error) {
          console.error('Failed to register wallet with backend:', error);
        }
        return;
      }

      // On mobile, check if returning from Phantom app
      if (isMobileDevice()) {
        // Wait a bit for Phantom to inject after returning from app
        setTimeout(async () => {
          const mobileAddress = getCurrentWalletAddress();
          if (mobileAddress) {
            setWalletAddress(mobileAddress);
            setWalletConnected(true);
            try {
              await connectPhantomWallet();
            } catch (error) {
              console.error('Failed to register wallet with backend:', error);
            }
          }
        }, 1000);
      }

      // If not connected, try to auto-connect if Phantom is available (desktop only)
      if (isPhantomInstalled() && !isMobileDevice()) {
        try {
          const result = await connectPhantomWallet();
          if (result.success && result.wallet) {
            setWalletAddress(result.wallet);
            setWalletConnected(true);
          }
        } catch (error) {
          // Silent fail - user will connect manually
        }
      }
    };

    checkAndConnect();

    // Listen for wallet account changes
    const cleanup = onWalletAccountChange((publicKey) => {
      if (publicKey) {
        setWalletAddress(publicKey);
        setWalletConnected(true);
        // Auto-register with backend when account changes
        connectPhantomWallet().catch(console.error);
      } else {
        setWalletAddress(null);
        setWalletConnected(false);
      }
    });

    // On mobile, also check periodically for Phantom injection
    let mobileCheckInterval: ReturnType<typeof setInterval> | null = null;
    if (isMobileDevice()) {
      mobileCheckInterval = setInterval(() => {
        const address = getCurrentWalletAddress();
        if (address && address !== walletAddress) {
          setWalletAddress(address);
          setWalletConnected(true);
          connectPhantomWallet().catch(console.error);
        }
      }, 2000);
    }

    // Listen for page visibility changes (user returning from mobile app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMobileDevice()) {
        // User returned to page, check for wallet
        setTimeout(() => {
          const address = getCurrentWalletAddress();
          if (address && address !== walletAddress) {
            setWalletAddress(address);
            setWalletConnected(true);
            connectPhantomWallet().catch(console.error);
          }
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanup();
      if (mobileCheckInterval) {
        clearInterval(mobileCheckInterval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [walletAddress]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const status = getPhantomStatus();
      
      // On mobile, handle differently
      if (status.isMobile) {
        // Check if Phantom is available in window
        if (!window.solana?.isPhantom) {
          // Open deep link to Phantom app
          openPhantomMobileApp();
          setError('Opening Phantom app. Please approve the connection and return to this page.');
          setIsConnecting(false);
          return;
        }
      }
      
      const result = await connectPhantomWallet();
      if (result.success && result.wallet) {
        setWalletAddress(result.wallet);
        setWalletConnected(true);
        setShowWalletModal(false);
        setError(null);
      } else {
        if (status.isMobile && !window.solana?.isPhantom) {
          openPhantomMobileApp();
          setError('Please install Phantom app or approve the connection.');
        } else {
          setError(result.error || 'Failed to connect wallet');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      const status = getPhantomStatus();
      if (status.isMobile) {
        openPhantomMobileApp();
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectPhantomWallet();
      setWalletAddress(null);
      setWalletConnected(false);
      setShowWalletModal(false);
    } catch (err) {
      console.error("Failed to disconnect", err);
    }
  };

  return (
    <WalletContext.Provider value={{
      walletConnected,
      walletAddress,
      isConnecting,
      error,
      showWalletModal,
      setShowWalletModal,
      connect,
      disconnect,
      setError
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
