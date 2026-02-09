# Phantom Wallet Mobile & Desktop Support

## Overview

The application now fully supports Phantom wallet on both:
- **Desktop**: Browser extension (Chrome, Firefox, Edge, Brave)
- **Mobile**: iOS and Android apps

## Features

### ✅ Desktop Support
- Automatic detection of Phantom browser extension
- Direct connection via `window.solana`
- Real-time connection status
- Account change listeners

### ✅ Mobile Support
- Deep linking to Phantom mobile app
- Automatic redirect when app is installed
- App Store/Play Store links when not installed
- Support for both iOS and Android

## Implementation Details

### Device Detection

```typescript
import { 
  isMobileDevice, 
  isIOSDevice, 
  isAndroidDevice,
  getPhantomStatus 
} from '@/lib/wallet';

// Check device type
const status = getPhantomStatus();
// Returns: { isDesktop, isMobile, isInstalled, canConnect, platform }
```

### Connection Flow

**Desktop:**
1. Check if extension is installed (`isPhantomInstalled()`)
2. Wait for extension to inject (`waitForPhantom()`)
3. Connect via `window.solana.connect()`
4. Register with backend

**Mobile:**
1. Detect mobile device
2. Check if app is available (`isPhantomMobileAvailable()`)
3. If available: Connect via injected `window.solana`
4. If not available: Open deep link to app (`openPhantomMobileApp()`)
5. User approves in app
6. Register with backend

### Deep Linking

Mobile deep links use Phantom's universal link format:
- iOS: `https://phantom.app/ul/v1/{encoded_url}`
- Android: `https://phantom.app/ul/v1/{encoded_url}`

## Usage Examples

### Connect Wallet

```typescript
import { connectPhantomWallet } from '@/services/walletService';

const result = await connectPhantomWallet();
if (result.success) {
  console.log('Connected:', result.wallet);
}
```

### Check Status

```typescript
import { getPhantomStatus } from '@/lib/wallet';

const status = getPhantomStatus();
if (status.isMobile) {
  // Show mobile-specific UI
} else if (status.isDesktop) {
  // Show desktop-specific UI
}
```

### Mobile App Redirect

```typescript
import { openPhantomMobileApp, isMobileDevice } from '@/lib/wallet';

if (isMobileDevice() && !isPhantomInstalled()) {
  openPhantomMobileApp(); // Opens Phantom app
}
```

## UI Components

### Navbar
- Shows "Phantom" on desktop
- Shows "Phantom App" on mobile
- Displays connection status
- Provides install links when needed

### Createtokens Page
- Mobile-aware connection prompts
- Different messages for desktop vs mobile
- Automatic app redirect on mobile

## Testing

### Desktop Testing
1. Install Phantom extension
2. Visit the site
3. Click "Connect Phantom Wallet"
4. Approve connection in extension popup

### Mobile Testing
1. Open site on mobile device
2. If app installed: Click "Open Phantom App"
3. If app not installed: Click install link
4. Approve connection in app

## Error Handling

- **Extension not found**: Shows install link
- **App not found**: Shows App Store/Play Store links
- **Connection rejected**: Shows user-friendly error
- **Network errors**: Retry with exponential backoff

## Notes

- Mobile deep linking requires user interaction (cannot auto-open)
- iOS requires HTTPS for deep links
- Android supports both HTTP and HTTPS
- Phantom app must be installed for mobile connection
- Extension must be installed for desktop connection
