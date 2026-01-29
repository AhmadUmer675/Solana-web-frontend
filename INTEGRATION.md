# Backend API Integration Guide

## Overview

The frontend has been fully integrated with the Solana Token Launcher backend API. All token creation functionality now works with real backend endpoints.

## What Was Integrated

### 1. API Service Layer (`src/lib/api.ts`)
- Base API request function
- Error handling
- Response type definitions
- Configurable base URL via environment variables

### 2. Wallet Service (`src/services/walletService.ts`)
- Phantom wallet connection
- Backend wallet registration
- Wallet address management

### 3. Token Service (`src/services/tokenService.ts`)
- Fee transaction retrieval
- Transaction signing and sending
- Token creation API calls
- Mint keypair generation

### 4. Wallet Library (`src/lib/wallet.ts`)
- Phantom wallet detection
- Connection/disconnection handlers
- Account change listeners
- TypeScript type definitions for Phantom

### 5. Updated Components

#### CreateToken Component
- ✅ Real wallet connection on mount
- ✅ Fee transaction handling
- ✅ Token creation with backend API
- ✅ Loading states and error handling
- ✅ Success messages
- ✅ Transaction signing flow

#### Navbar Component
- ✅ Real wallet connection
- ✅ Wallet address display
- ✅ Connection status management
- ✅ Account change listeners

## API Endpoints Used

1. **POST /api/wallet/connect**
   - Connects and validates Phantom wallet
   - Used in: `walletService.ts`

2. **POST /api/token/fee-transaction**
   - Gets unsigned 0.10 SOL fee transaction
   - Used in: `tokenService.ts` → `getFeeTransaction()`

3. **POST /api/token/create**
   - Creates SPL token after fee verification
   - Used in: `tokenService.ts` → `createTokenOnBackend()`

## Token Creation Flow

1. **User connects wallet** → `connectPhantomWallet()`
2. **User fills form** → Token info, supply, details
3. **User clicks "Create Token"** → `handleCreateToken()`
4. **Get fee transaction** → `getFeeTransaction()`
5. **Sign fee transaction** → `signAndSendFeeTransaction()`
6. **Create token on backend** → `createTokenOnBackend()`
7. **Sign token transaction** → `signAndSendTokenTransaction()`
8. **Token created!** → Success message with mint address

## Required Dependencies

Make sure to install these packages:

```bash
npm install @solana/web3.js @solana/spl-token
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

For testing on devnet:
```env
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- User rejection (transaction signing)
- Backend validation errors
- Wallet connection errors

Errors are displayed in a user-friendly format with dismissible alerts.

## Loading States

The UI shows loading indicators during:
- Wallet connection
- Fee transaction processing
- Token creation
- Transaction signing

## Next Steps

1. **Install dependencies**: Run `npm install @solana/web3.js @solana/spl-token`
2. **Start backend**: Make sure backend is running on port 3000
3. **Configure environment**: Set up `.env` file
4. **Test**: Connect wallet and create a test token

## Notes

- All transactions require user approval in Phantom wallet
- Fee transaction must be completed before token creation
- Mint keypair is generated on the frontend (secret key stays in browser)
- Token appears in Phantom wallet automatically after creation
