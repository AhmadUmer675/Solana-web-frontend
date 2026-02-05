import apiRequest from '@/lib/api';
import { Transaction, Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Buffer } from 'buffer';

// Solana connection
const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

/* ===================== TYPES ===================== */

export interface FeeTransactionResponse {
  success: boolean;
  serializedTransaction?: string;
  lastValidBlockHeight?: number;
  feeAmount?: string;
  message?: string;
  error?: string;
}

export interface CreateTokenResponse {
  success: boolean;
  serializedTransaction?: string;
  lastValidBlockHeight?: number;
  mintAddress?: string;
  tokenId?: number;
  feePaid?: boolean;
  message?: string;
  error?: string;
}

export interface CreateTokenParams {
  tokenName: string;
  symbol: string;
  supply: string | number;
  decimals?: number;
  description?: string;
  logoUri?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  feeTxSignature: string;
  mintPublicKey: string;
}

export async function uploadToIPFS(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiRequest<{ url: string }>('/upload/ipfs', {
    method: 'POST',
    body: formData,
  });

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true, url: response.data?.url };
}

/* ===================== API CALLS ===================== */

export async function getFeeTransaction(walletAddress: string) {
  const response = await apiRequest<FeeTransactionResponse>('/token/fee-transaction', {
    method: 'POST',
    body: JSON.stringify({ wallet: walletAddress }),
  });

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return {
    success: true,
    serializedTransaction: response.data?.serializedTransaction,
    lastValidBlockHeight: response.data?.lastValidBlockHeight,
    feeAmount: response.data?.feeAmount,
  };
}

/* ===================== SIGN & SEND ===================== */

export async function signAndSendFeeTransaction(
  serializedTransaction: string
) {
  try {
    if (!window.solana?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const transaction = Transaction.from(
      Buffer.from(serializedTransaction, 'base64')
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    if (window.solana?.publicKey) {
      transaction.feePayer = new PublicKey(window.solana.publicKey.toBase58());
    }

    const signedTx = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTx.serialize()
    );

    await connection.confirmTransaction(signature, 'confirmed');

    return { success: true, signature };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* ===================== TOKEN CREATION ===================== */

export async function createTokenOnBackend(
  walletAddress: string,
  params: CreateTokenParams
) {
  const response = await apiRequest<CreateTokenResponse>('/token/create', {
    method: 'POST',
    body: JSON.stringify({ wallet: walletAddress, ...params }),
  });

  if (!response.success) {
    return { success: false, error: response.error };
  }

  return { success: true, ...response.data };
}

export async function signAndSendTokenTransaction(
  serializedTransaction: string,
  mintKeypair: Keypair
) {
  try {
    if (!window.solana?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const transaction = Transaction.from(
      Buffer.from(serializedTransaction, 'base64')
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    if (window.solana?.publicKey) {
      transaction.feePayer = new PublicKey(window.solana.publicKey.toBase58());
    }

    const signedTx = await window.solana.signTransaction(transaction);
    signedTx.partialSign(mintKeypair);

    const signature = await connection.sendRawTransaction(
      signedTx.serialize()
    );

    await connection.confirmTransaction(signature, 'confirmed');

    return {
      success: true,
      signature,
      mintAddress: mintKeypair.publicKey.toBase58(),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/* ===================== HELPERS ===================== */

export function generateMintKeypair(): Keypair {
  return Keypair.generate();
}

export async function getWalletBalanceSOL(walletAddress: string) {
  try {
    const lamports = await connection.getBalance(new PublicKey(walletAddress));
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return null;
  }
}
