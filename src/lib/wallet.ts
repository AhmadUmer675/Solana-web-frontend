/**
 * Phantom Wallet Integration
 * Handles wallet connection for Desktop (Extension) and Mobile (App)
 * Supports both browser extension and mobile deep linking
 */

/* ===============================
   Phantom Provider Type
================================ */
interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toBase58(): string };
  isConnected: boolean;
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toBase58(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  on(event: string, callback: (args: any) => void): void;
  request?(args: { method: string; params?: any }): Promise<any>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

/* ===============================
   Device Detection
================================ */

/**
 * Check if running on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if running on iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Check if running on Android
 */
export function isAndroidDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

/* ===============================
   Utils
================================ */

/**
 * Check if Phantom wallet is installed (Desktop Extension)
 */
export function isPhantomInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.solana?.isPhantom;
}

/**
 * Check if Phantom mobile app is available (Mobile)
 */
export function isPhantomMobileAvailable(): boolean {
  if (typeof window === "undefined") return false;
  // On mobile, Phantom injects solana object when app is installed
  // We can also check for deep link support
  return isMobileDevice() && (!!window.solana || canOpenPhantomApp());
}

/**
 * Check if we can open Phantom app via deep link
 */
function canOpenPhantomApp(): boolean {
  if (typeof window === "undefined") return false;
  // Phantom uses custom URL schemes
  return isMobileDevice();
}

/**
 * Get Phantom deep link URL for mobile
 */
export function getPhantomDeepLink(url?: string): string {
  const baseUrl = url || window.location.href;
  // Phantom uses universal links
  return `https://phantom.app/ul/v1/${encodeURIComponent(baseUrl)}`;
}

/**
 * Open Phantom app on mobile via deep link
 */
export function openPhantomMobileApp(url?: string): void {
  if (!isMobileDevice()) return;
  
  const deepLink = getPhantomDeepLink(url);
  
  // Try to open in app, fallback to browser
  try {
    // For iOS, use window.location
    if (isIOSDevice()) {
      window.location.href = deepLink;
    } 
    // For Android, try window.open first, then location
    else if (isAndroidDevice()) {
      const opened = window.open(deepLink, '_blank');
      if (!opened) {
        window.location.href = deepLink;
      }
    } else {
      window.location.href = deepLink;
    }
  } catch (error) {
    // Fallback
    window.location.href = deepLink;
  }
}

/**
 * Get current connected wallet address
 */
export function getCurrentWalletAddress(): string | null {
  if (typeof window === "undefined") return null;
  
  if (window.solana?.isConnected && window.solana.publicKey) {
    return window.solana.publicKey.toBase58();
  }
  return null;
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.solana?.isConnected && !!window.solana.publicKey;
}

/* ===============================
   Wallet Actions
================================ */

/**
 * Connect to Phantom wallet
 * Supports both Desktop (Extension) and Mobile (App)
 * MAIN EXPORT - Use this name in imports
 */
export async function connectPhantom(options?: {
  onlyIfTrusted?: boolean;
  redirectToMobile?: boolean;
}): Promise<{
  success: boolean;
  publicKey?: string;
  error?: string;
  isMobile?: boolean;
}> {
  try {
    // Check if on mobile device
    if (isMobileDevice()) {
      return await connectPhantomMobile(options);
    }

    // Desktop extension flow
    return await connectPhantomDesktop(options);
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to connect to Phantom wallet",
    };
  }
}

/**
 * Connect to Phantom on Desktop (Extension)
 */
async function connectPhantomDesktop(options?: {
  onlyIfTrusted?: boolean;
}): Promise<{
  success: boolean;
  publicKey?: string;
  error?: string;
}> {
  try {
    // Wait for Phantom to be available
    const isReady = await waitForPhantom(5000);
    if (!isReady) {
      return {
        success: false,
        error: "Phantom wallet extension not detected. Please install it from https://phantom.app",
      };
    }

    const provider = window.solana!;

    // Already connected
    if (provider.isConnected && provider.publicKey) {
      return {
        success: true,
        publicKey: provider.publicKey.toBase58(),
      };
    }

    // Connect with options
    const connectOptions = options?.onlyIfTrusted ? { onlyIfTrusted: true } : {};
    const response = await provider.connect(connectOptions);
    
    return {
      success: true,
      publicKey: response.publicKey.toBase58(),
    };
  } catch (error: any) {
    if (error?.code === 4001) {
      return {
        success: false,
        error: "User rejected the connection request",
      };
    }

    return {
      success: false,
      error: error?.message || "Failed to connect to Phantom wallet",
    };
  }
}

/**
 * Connect to Phantom on Mobile (App)
 */
async function connectPhantomMobile(options?: {
  redirectToMobile?: boolean;
}): Promise<{
  success: boolean;
  publicKey?: string;
  error?: string;
  isMobile?: boolean;
}> {
  try {
    // First, wait a bit for Phantom to inject (in case user just returned from app)
    await waitForPhantom(3000);
    
    // Check if Phantom is available
    if (window.solana?.isPhantom) {
      const provider = window.solana;
      
      // Already connected
      if (provider.isConnected && provider.publicKey) {
        return {
          success: true,
          publicKey: provider.publicKey.toBase58(),
          isMobile: true,
        };
      }

      // Try to connect
      try {
        const response = await provider.connect();
        return {
          success: true,
          publicKey: response.publicKey.toBase58(),
          isMobile: true,
        };
      } catch (error: any) {
        if (error?.code === 4001) {
          return {
            success: false,
            error: "User rejected the connection request",
            isMobile: true,
          };
        }
        
        // If connection fails, try deep link
        if (options?.redirectToMobile !== false) {
          openPhantomMobileApp();
        }
        return {
          success: false,
          error: "Please approve the connection in Phantom app",
          isMobile: true,
        };
      }
    }

    // Phantom not detected - try deep link
    if (options?.redirectToMobile !== false) {
      // Store current URL for return
      const currentUrl = window.location.href;
      sessionStorage.setItem('phantom_return_url', currentUrl);
      
      // Open deep link
      openPhantomMobileApp(currentUrl);
      
      // Wait a bit to see if user approves and returns
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check again if Phantom injected
      if (window.solana?.isPhantom) {
        try {
          const response = await window.solana.connect();
          return {
            success: true,
            publicKey: response.publicKey.toBase58(),
            isMobile: true,
          };
        } catch (err: any) {
          return {
            success: false,
            error: "Please approve the connection in Phantom app and return to this page",
            isMobile: true,
          };
        }
      }
      
      return {
        success: false,
        error: "Opening Phantom app. Please approve the connection and return to this page.",
        isMobile: true,
      };
    }

    return {
      success: false,
      error: "Phantom app not detected. Please install Phantom from App Store or Play Store.",
      isMobile: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to connect to Phantom on mobile",
      isMobile: true,
    };
  }
}

/**
 * Alternative export name for backwards compatibility
 * Note: This is an alias, not a separate function
 */
// export const connectPhantomWallet = connectPhantom; // Removed to avoid duplicate export

/**
 * Disconnect Phantom wallet
 */
export async function disconnectPhantom(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (typeof window === "undefined") {
      return { success: false, error: "Window is not defined" };
    }

    if (window.solana?.isConnected) {
      await window.solana.disconnect();
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error disconnecting wallet:", error);
    return {
      success: false,
      error: error?.message || "Failed to disconnect wallet",
    };
  }
}

/**
 * Alternative export name for backwards compatibility
 * Note: This is an alias, not a separate function
 */
// export const disconnectPhantomWallet = disconnectPhantom; // Removed to avoid duplicate export

/**
 * Listen for wallet account changes
 */
export function onWalletAccountChange(
  callback: (publicKey: string | null) => void
): () => void {
  if (typeof window === "undefined" || !window.solana) {
    return () => {};
  }

  const handler = (publicKey: any) => {
    callback(publicKey ? publicKey.toBase58() : null);
  };

  window.solana.on("accountChanged", handler);
  window.solana.on("disconnect", () => callback(null));

  return () => {
    // Phantom doesn't support `off`, so noop cleanup
  };
}

/**
 * Get wallet balance (in SOL)
 * Note: Requires @solana/web3.js to be installed
 */
export async function getWalletBalance(): Promise<{
  success: boolean;
  balance?: number;
  error?: string;
}> {
  try {
    const address = getCurrentWalletAddress();
    if (!address) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    // This is a placeholder - you'll need @solana/web3.js for actual implementation
    return {
      success: false,
      error: "Balance check requires @solana/web3.js library",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to get wallet balance",
    };
  }
}

/**
 * Request wallet connection with retry logic
 */
export async function connectWithRetry(maxRetries = 3): Promise<{
  success: boolean;
  publicKey?: string;
  error?: string;
}> {
  for (let i = 0; i < maxRetries; i++) {
    const result = await connectPhantom();
    if (result.success) {
      return result;
    }
    
    // Wait before retry (exponential backoff)
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  return {
    success: false,
    error: `Failed to connect after ${maxRetries} attempts`,
  };
}

/* ===============================
   Event Helpers
================================ */

/**
 * Wait for Phantom to be available (Desktop Extension & Mobile)
 */
export function waitForPhantom(timeout = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    // Check immediately
    if (isPhantomInstalled() || (isMobileDevice() && window.solana?.isPhantom)) {
      resolve(true);
      return;
    }

    // On mobile, check for app availability with longer timeout
    if (isMobileDevice()) {
      const mobileTimeout = Math.min(timeout, 5000); // Longer timeout for mobile
      const start = Date.now();
      const interval = setInterval(() => {
        if (window.solana?.isPhantom) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > mobileTimeout) {
          clearInterval(interval);
          resolve(false);
        }
      }, 200); // Check every 200ms on mobile
      return;
    }

    // Desktop: wait for extension injection
    const start = Date.now();
    const interval = setInterval(() => {
      if (isPhantomInstalled()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Get device type and Phantom availability
 */
export function getPhantomStatus(): {
  isDesktop: boolean;
  isMobile: boolean;
  isInstalled: boolean;
  canConnect: boolean;
  platform: 'desktop' | 'mobile' | 'unknown';
} {
  const isDesktop = !isMobileDevice();
  const isMobile = isMobileDevice();
  const isInstalled = isPhantomInstalled() || (isMobile && !!window.solana);
  
  return {
    isDesktop,
    isMobile,
    isInstalled,
    canConnect: isInstalled,
    platform: isDesktop ? 'desktop' : isMobile ? 'mobile' : 'unknown',
  };
}

/* ===============================
   Exports Summary
================================ */

// Default export for convenience
export default {
  // Device detection
  isMobileDevice,
  isIOSDevice,
  isAndroidDevice,
  getPhantomStatus,
  
  // Connection
  connectPhantom,
  disconnectPhantom,
  connectWithRetry,
  
  // Mobile
  isPhantomMobileAvailable,
  getPhantomDeepLink,
  openPhantomMobileApp,
  
  // Utils
  isPhantomInstalled,
  getCurrentWalletAddress,
  isWalletConnected,
  getWalletBalance,
  
  // Events
  onWalletAccountChange,
  waitForPhantom,
};