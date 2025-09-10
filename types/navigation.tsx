/**
 * Type definitions for navigation elements in Vizor
 * These types are used across the application for consistent navigation structures
 */

export type NavigationType = "internal" | "external" | "modal" | "";

// Base interface for any navigation item
interface BaseNavItem {
  id: string;
  title?: string;
  link: string;
  type: NavigationType;
  open: boolean;
}

// Navigation item that can have children
export interface MenuItem extends BaseNavItem {
  child: MenuItem[];
}

// Legal link items in footer
export interface LegalLink extends BaseNavItem {
  child: LegalLink[];
}

// Social media links
export interface SocialLink {
  id: string;
  link: string;
}

// For settings menu items
export interface SettingsMenuItem extends BaseNavItem {
  icon?: string;
  description?: string;
  disabled?: boolean;
  child: SettingsMenuItem[];
}

// For web3 network configuration
export interface NetworkConfig {
  id: number;
  name: string;
  shortName: string;
  chainId: string;
  networkType: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  icon: string;
  testnet: boolean;
}
