/**
 * API Permission Validation
 * Server-side validation for wallet-based permissions
 */

import { NextRequest } from 'next/server';

// Authorized wallet addresses that can add/edit/delete investment projects
const AUTHORIZED_ADDRESSES = [
  '0x9C48405d8E4d107C9DC033993d18D60F67380ca1', // Revoluzion Ecosystem Wallet
  // Add more authorized wallets as needed
];

// Admin wallet addresses that can access debug dashboard
const ADMIN_ADDRESSES = [
  '0x9C48405d8E4d107C9DC033993d18D60F67380ca1', // Revoluzion Ecosystem Wallet
  // Add more admin wallets as needed
];

/**
 * Extract wallet address from request headers
 */
export function getWalletFromRequest(request: NextRequest): string | null {
  // Check for wallet address in authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Wallet ')) {
    return authHeader.substring(7); // Remove 'Wallet ' prefix
  }

  // Check for wallet address in custom header
  const walletHeader = request.headers.get('x-wallet-address');
  if (walletHeader) {
    return walletHeader;
  }

  return null;
}

/**
 * Check if wallet address is authorized for admin access
 */
export function isAdminWallet(walletAddress: string | null): boolean {
  if (!walletAddress) return false;

  return ADMIN_ADDRESSES.some(addr => addr.toLowerCase() === walletAddress.toLowerCase());
}

/**
 * Check if wallet address is authorized for write operations
 */
export function isAuthorizedWallet(walletAddress: string | null): boolean {
  if (!walletAddress) return false;

  return AUTHORIZED_ADDRESSES.some(addr => addr.toLowerCase() === walletAddress.toLowerCase());
}

/**
 * Validate write permissions (add/edit/delete)
 */
export function validateWritePermissions(request: NextRequest): {
  authorized: boolean;
  walletAddress: string | null;
  error?: string;
} {
  const walletAddress = getWalletFromRequest(request);

  if (!walletAddress) {
    return {
      authorized: false,
      walletAddress: null,
      error: 'No wallet address provided. Please connect your wallet.',
    };
  }

  if (!isAuthorizedWallet(walletAddress)) {
    return {
      authorized: false,
      walletAddress,
      error: 'Unauthorized wallet. Only authorized Vizor team members can modify investments.',
    };
  }

  return {
    authorized: true,
    walletAddress,
  };
}

/**
 * Validate read permissions (view only)
 * Currently allows everyone to read
 */
export function validateReadPermissions(request: NextRequest): {
  authorized: boolean;
  walletAddress: string | null;
  error?: string;
} {
  const walletAddress = getWalletFromRequest(request);

  return {
    authorized: true, // Public read access
    walletAddress,
  };
}
