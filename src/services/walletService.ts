/**
 * Wallet Service - Complete Integration
 * Handles Phantom wallet connection and backend synchronization
 */

import apiRequest from '@/lib/api';
import { 
  connectPhantom, 
  disconnectPhantom,
  getCurrentWalletAddress, // ✅ CORRECT IMPORT NAME
  isPhantomInstalled,
  isWalletConnected,
  onWalletAccountChange,
  waitForPhantom,
  isMobileDevice,
  getPhantomStatus,
  isPhantomMobileAvailable
} from '@/lib/wallet';

/* ===============================
   Types
================================ */

export interface ConnectWalletResponse {
  success: boolean;
  wallet?: string;
  message?: string;
  error?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

/* ===============================
   Backend API Calls
================================ */

/**
 * Connect wallet to backend
 */
export async function connectWalletToBackend(
  walletAddress: string
): Promise<ConnectWalletResponse> {
  try {
    const response = await apiRequest<ConnectWalletResponse>('/wallet/connect', {
      method: 'POST',
      body: JSON.stringify({ wallet: walletAddress }),
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to connect wallet to backend',
      };
    }

    return {
      success: true,
      wallet: response.data?.wallet || walletAddress,
      message: response.data?.message || 'Wallet connected successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Backend connection failed',
    };
  }
}

/**
 * Disconnect wallet from backend
 */
export async function disconnectWalletFromBackend(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await apiRequest<{ success: boolean }>('/wallet/disconnect', {
      method: 'POST',
    });

    return {
      success: response.success,
      error: response.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect from backend',
    };
  }
}

/* ===============================
   Main Wallet Functions
================================ */

/**
 * Connect Phantom wallet and register with backend
 * ✅ COMPLETE FLOW: Phantom → Backend
 * Supports both Desktop (Extension) and Mobile (App)
 */
export async function connectPhantomWallet(): Promise<ConnectWalletResponse> {
  try {
    const status = getPhantomStatus();
    
    // Step 1: Check if Phantom is available (Desktop or Mobile)
    if (!status.isInstalled && !status.isMobile) {
      return {
        success: false,
        error: 'Phantom wallet is not installed. Please install from https://phantom.app',
      };
    }

    // Step 2: Wait for Phantom to be ready (Desktop only)
    if (status.isDesktop) {
      const isReady = await waitForPhantom(5000);
      if (!isReady) {
        return {
          success: false,
          error: 'Phantom wallet extension is not ready. Please refresh the page.',
        };
      }
    }

    // Step 3: Connect to Phantom (handles both desktop and mobile)
    const phantomResult = await connectPhantom({
      redirectToMobile: true, // Allow mobile redirect
    });
    
    if (!phantomResult.success || !phantomResult.publicKey) {
      // On mobile, if connection fails, it might redirect to app
      if (status.isMobile && phantomResult.isMobile) {
        return {
          success: false,
          error: phantomResult.error || 'Please approve the connection in Phantom app',
        };
      }
      
      return {
        success: false,
        error: phantomResult.error || 'Failed to connect to Phantom wallet',
      };
    }

    // Step 4: Register wallet with backend
    const backendResult = await connectWalletToBackend(phantomResult.publicKey);
    
    if (!backendResult.success) {
      return {
        success: false,
        error: backendResult.error || 'Failed to register wallet with backend',
      };
    }

    return {
      success: true,
      wallet: phantomResult.publicKey,
      message: backendResult.message || 'Wallet connected successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect wallet',
    };
  }
}

/**
 * Disconnect Phantom wallet and from backend
 * ✅ COMPLETE FLOW: Backend → Phantom
 */
export async function disconnectPhantomWallet(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Step 1: Disconnect from backend first
    const backendResult = await disconnectWalletFromBackend();
    
    // Step 2: Disconnect from Phantom (even if backend fails)
    const phantomResult = await disconnectPhantom();
    
    if (!backendResult.success && !phantomResult.success) {
      return {
        success: false,
        error: 'Failed to disconnect from both backend and wallet',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect wallet',
    };
  }
}

/* ===============================
   Utility Functions
================================ */

/**
 * Get current wallet address (alias for clarity)
 * ✅ CORRECT EXPORT
 */
export function getWalletAddress(): string | null {
  return getCurrentWalletAddress();
}

/**
 * Get current wallet address (original name)
 */
export { getCurrentWalletAddress };

/**
 * Check if wallet is currently connected
 */
export function checkWalletConnection(): boolean {
  return isWalletConnected();
}

/**
 * Get complete wallet state
 */
export function getWalletState(): WalletState {
  return {
    isConnected: isWalletConnected(),
    address: getCurrentWalletAddress(),
    isLoading: false,
    error: null,
  };
}

/* ===============================
   Event Listeners
================================ */

/**
 * Listen for wallet changes and sync with backend
 */
export function setupWalletListener(
  onAccountChange?: (address: string | null) => void
): () => void {
  return onWalletAccountChange(async (publicKey) => {
    // Call custom callback
    if (onAccountChange) {
      onAccountChange(publicKey);
    }

    // Sync with backend
    if (publicKey) {
      await connectWalletToBackend(publicKey);
    } else {
      await disconnectWalletFromBackend();
    }
  });
}

/* ===============================
   Verification Functions
================================ */

/**
 * Verify wallet signature (for authentication)
 */
export async function verifyWalletSignature(
  message: string,
  signature: string,
  walletAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiRequest<{ success: boolean; verified: boolean }>(
      '/wallet/verify',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          signature,
          wallet: walletAddress,
        }),
      }
    );

    if (!response.success || !response.data?.verified) {
      return {
        success: false,
        error: 'Signature verification failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Request wallet to sign a message
 */
export async function signMessage(message: string): Promise<{
  success: boolean;
  signature?: string;
  error?: string;
}> {
  try {
    if (!isWalletConnected()) {
      return {
        success: false,
        error: 'Wallet not connected',
      };
    }

    // This requires additional implementation with Phantom's signMessage API
    return {
      success: false,
      error: 'Message signing not yet implemented',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign message',
    };
  }
}

/* ===============================
   Reconnection Logic
================================ */

/**
 * Try to reconnect wallet on page load
 */
export async function autoReconnectWallet(): Promise<{
  success: boolean;
  wallet?: string;
  error?: string;
}> {
  try {
    // Check if wallet was previously connected
    if (!isWalletConnected()) {
      return {
        success: false,
        error: 'No wallet previously connected',
      };
    }

    const address = getCurrentWalletAddress();
    if (!address) {
      return {
        success: false,
        error: 'Could not retrieve wallet address',
      };
    }

    // Sync with backend
    const result = await connectWalletToBackend(address);
    
    return {
      success: result.success,
      wallet: address,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Auto-reconnect failed',
    };
  }
}

/* ===============================
   Export Everything
================================ */

export default {
  // Main functions
  connectPhantomWallet,
  disconnectPhantomWallet,
  
  // Backend functions
  connectWalletToBackend,
  disconnectWalletFromBackend,
  
  // Utility functions
  getWalletAddress,
  getCurrentWalletAddress,
  checkWalletConnection,
  getWalletState,
  isPhantomInstalled,
  
  // Event listeners
  setupWalletListener,
  
  // Verification
  verifyWalletSignature,
  signMessage,
  
  // Auto-reconnect
  autoReconnectWallet,
};