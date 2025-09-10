import { SettingsMenuItem } from '@/types/navigation';

export interface SettingsConfig {
    general: SettingsGeneral;
    wallet: SettingsWallet;
    network: SettingsNetwork;
    appearance: SettingsAppearance;
    language: SettingsLanguage;
}

export interface SettingsGeneral {
    currency: string;
    dateFormat: string;
    timeFormat: string;
}

export interface SettingsWallet {
    hideSmallBalances: boolean;
    hideTokenBalances: boolean;
    approvalConfirmation: boolean;
}

export interface SettingsNetwork {
    customRPC: Record<string, string>;
}

export interface SettingsAppearance {
    theme: 'dark' | 'light' | 'system';
    animationsEnabled: boolean;
    compactMode: boolean;
}

export interface SettingsLanguage {
    current: string;
    autoDetect: boolean;
}

// Default settings configuration
export const defaultSettings: SettingsConfig = {
    general: {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '24h',
    },
    wallet: {
        hideSmallBalances: true,
        hideTokenBalances: false,
        approvalConfirmation: true,
    },
    network: {
        customRPC: {},
    },
    appearance: {
        theme: 'dark',
        animationsEnabled: true,
        compactMode: false,
    },
    language: {
        current: 'en',
        autoDetect: true,
    },
};

// Settings menu structure
export const settingsMenu: SettingsMenuItem[] = [
    {
        id: 'wallet',
        title: 'Wallet',
        link: '/settings/wallet',
        type: 'internal',
        open: false,
        icon: 'wallet',
        description: 'Wallet connection and transaction preferences',
        child: [],
    },
    {
        id: 'networks',
        title: 'Networks',
        link: '/settings/networks',
        type: 'internal',
        open: false,
        icon: 'globe',
        description: 'Blockchain network configurations',
        child: [],
    },
    {
        id: 'appearance',
        title: 'Appearance',
        link: '/settings/appearance',
        type: 'internal',
        open: false,
        icon: 'palette',
        description: 'Visual preferences and layout options',
        child: [],
    },
    {
        id: 'language',
        title: 'Language & Region',
        link: '/settings/language',
        type: 'internal',
        open: false,
        icon: 'globe',
        description: 'Language and localization preferences',
        child: [],
    },
];

export default Object.freeze({
    defaultSettings,
    settingsMenu,
});
