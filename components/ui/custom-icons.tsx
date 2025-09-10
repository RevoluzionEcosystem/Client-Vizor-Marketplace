// Custom SVG Icons for Vizor
import React from 'react';

export const VizorLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vizorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF"/>
        <stop offset="50%" stopColor="#0EA5E9"/>
        <stop offset="100%" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
    <path d="M20 40 L80 160 L140 40 L180 40 L100 180 L20 40 Z" fill="url(#vizorGradient)"/>
    <path d="M40 40 L100 140 L160 40" stroke="white" strokeWidth="3" fill="none" opacity="0.8"/>
    <path d="M60 40 L100 100 L140 40" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
  </svg>
);

export const GovernanceIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="govGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4"/>
        <stop offset="100%" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
    <path d="M3 9V21H21V9L12 2L3 9Z" fill="url(#govGradient)" opacity="0.2"/>
    <path d="M12 2L3 9V21H21V9L12 2Z" stroke="url(#govGradient)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M7 12H17M7 16H17" stroke="url(#govGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="6" r="1.5" fill="url(#govGradient)"/>
  </svg>
);

export const VotingIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="voteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0EA5E9"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#voteGradient)" opacity="0.2"/>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="url(#voteGradient)" strokeWidth="2"/>
    <path d="M7 12L10 15L17 8" stroke="url(#voteGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="6" r="2" fill="#10B981"/>
  </svg>
);

export const TreasuryIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="treasuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="url(#treasuryGradient)" opacity="0.2"/>
    <path d="M2 8H22M2 8V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8M2 8L4 4H20L22 8" stroke="url(#treasuryGradient)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M8 12H16M10 16H14" stroke="url(#treasuryGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="14" r="2" stroke="url(#treasuryGradient)" strokeWidth="2"/>
  </svg>
);

export const TokenIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B"/>
        <stop offset="100%" stopColor="#EF4444"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="8" fill="url(#tokenGradient)" opacity="0.2"/>
    <circle cx="12" cy="12" r="8" stroke="url(#tokenGradient)" strokeWidth="2"/>
    <path d="M8 12H16M12 8V16" stroke="url(#tokenGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="url(#tokenGradient)" strokeWidth="2"/>
  </svg>
);

export const ProposalIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="proposalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4"/>
        <stop offset="100%" stopColor="#10B981"/>
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#proposalGradient)" opacity="0.2"/>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#proposalGradient)" strokeWidth="2"/>
    <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#proposalGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="2" fill="#F59E0B"/>
  </svg>
);

export const AnalyticsIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
    </defs>
    <path d="M3 18V12M9 18V8M15 18V14M21 18V10" stroke="url(#analyticsGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="3" cy="12" r="2" fill="url(#analyticsGradient)"/>
    <circle cx="9" cy="8" r="2" fill="url(#analyticsGradient)"/>
    <circle cx="15" cy="14" r="2" fill="url(#analyticsGradient)"/>
    <circle cx="21" cy="10" r="2" fill="url(#analyticsGradient)"/>
    <path d="M5 12L7 8M11 8L13 14M17 14L19 10" stroke="url(#analyticsGradient)" strokeWidth="2"/>
  </svg>
);

export const CommunityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981"/>
        <stop offset="100%" stopColor="#059669"/>
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="3" fill="url(#communityGradient)" opacity="0.3"/>
    <circle cx="15" cy="7" r="3" fill="url(#communityGradient)" opacity="0.3"/>
    <circle cx="12" cy="12" r="3" fill="url(#communityGradient)" opacity="0.3"/>
    <circle cx="9" cy="7" r="3" stroke="url(#communityGradient)" strokeWidth="2"/>
    <circle cx="15" cy="7" r="3" stroke="url(#communityGradient)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="url(#communityGradient)" strokeWidth="2"/>
    <path d="M6 21V19C6 16.79 7.79 15 10 15H14C16.21 15 18 16.79 18 19V21" stroke="url(#communityGradient)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SecurityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444"/>
        <stop offset="100%" stopColor="#DC2626"/>
      </linearGradient>
    </defs>
    <path d="M12 2L3 7V13C3 17.55 6.84 21.74 12 22C17.16 21.74 21 17.55 21 13V7L12 2Z" fill="url(#securityGradient)" opacity="0.2"/>
    <path d="M12 2L3 7V13C3 17.55 6.84 21.74 12 22C17.16 21.74 21 17.55 21 13V7L12 2Z" stroke="url(#securityGradient)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M8 12L11 15L16 9" stroke="url(#securityGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const VizorBrandIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF"/>
        <stop offset="50%" stopColor="#0EA5E9"/>
        <stop offset="100%" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
    <path d="M2 4 L10 20 L14 4 L22 4 L12 22 L2 4 Z" fill="url(#brandGradient)"/>
    <path d="M4 4 L12 16 L20 4" stroke="white" strokeWidth="1" fill="none" opacity="0.8"/>
    <circle cx="18" cy="6" r="2" fill="#10B981" opacity="0.8"/>
  </svg>
);

export const UtilityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="utilityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#utilityGradient)" opacity="0.2"/>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="url(#utilityGradient)" strokeWidth="2"/>
    <path d="M8 8H16M8 12H14M8 16H12" stroke="url(#utilityGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="2" fill="#F59E0B"/>
  </svg>
);

export const PartnershipIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="partnershipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981"/>
        <stop offset="100%" stopColor="#059669"/>
      </linearGradient>
    </defs>
    <path d="M16 21V19C16 16.79 14.21 15 12 15H5C2.79 15 1 16.79 1 19V21" stroke="url(#partnershipGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="url(#partnershipGradient)" strokeWidth="2"/>
    <path d="M23 21V19C23 17.13 21.63 15.57 19.89 15.14" stroke="url(#partnershipGradient)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 3.13C17.74 3.56 19 5.13 19 7S17.74 10.44 16 10.87" stroke="url(#partnershipGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="8" r="2" fill="#06B6D4"/>
  </svg>
);

export const ProductIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="productGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="3" stroke="url(#productGradient)" strokeWidth="2"/>
    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="url(#productGradient)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="6" stroke="url(#productGradient)" strokeWidth="2" opacity="0.3"/>
  </svg>
);

export const FinanceIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="financeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B"/>
        <stop offset="100%" stopColor="#EF4444"/>
      </linearGradient>
    </defs>
    <path d="M12 2V22M17 5H9.5C8.57 5 7.75 5.84 7.75 6.89C7.75 7.95 8.57 8.78 9.5 8.78H14.5C15.43 8.78 16.25 9.62 16.25 10.67C16.25 11.72 15.43 12.56 14.5 12.56H7" stroke="url(#financeGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="url(#financeGradient)" strokeWidth="2" opacity="0.3"/>
  </svg>
);
