import React from 'react';

// Crisp SVG flags for guaranteed rendering on all OS/browsers (Windows/Linux/macOS/iOS/Android)
// where Unicode regional indicators render as letters like 'LB', 'SK' instead of flags.

export function FlagIcon({ countryCode, className = 'w-4 h-3' }: { countryCode?: string; className?: string }) {
  const code = (countryCode || '').toUpperCase();

  switch (code) {
    case 'LB':
      // Lebanon: Red stripes top and bottom, white middle with green Cedar tree
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="Lebanon flag">
          <rect width="30" height="5" fill="#ED1C24" />
          <rect y="5" width="30" height="10" fill="#FFFFFF" />
          <rect y="15" width="30" height="5" fill="#ED1C24" />
          {/* Cedar tree */}
          <path d="M15 6.5 L17.5 10.5 L16.5 10.5 L18.5 13 L16 13 L18.5 14.5 L11.5 14.5 L14 13 L11.5 13 L13.5 10.5 L12.5 10.5 Z" fill="#00A651" />
          <rect x="14.3" y="14.5" width="1.4" height="1" fill="#784421" />
        </svg>
      );

    case 'SK':
      // Slovakia: White, Blue, Red with Slovak coat of arms
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="Slovakia flag">
          <rect width="30" height="6.67" fill="#FFFFFF" />
          <rect y="6.67" width="30" height="6.67" fill="#0B4EA2" />
          <rect y="13.34" width="30" height="6.67" fill="#EE1C25" />
          {/* Shield */}
          <path d="M6 5.5 C6 5.5, 11 5.5, 11 5.5 C11 11, 8.5 13.5, 8.5 13.5 C8.5 13.5, 6 11, 6 5.5 Z" fill="#EE1C25" stroke="#FFFFFF" strokeWidth="0.5" />
          {/* Blue triple mountain */}
          <path d="M6.5 12 C7 11, 7.5 11, 8 11.5 C8.5 10.5, 9.5 10.5, 10 11.5 C10.2 12, 10.5 12, 10.5 12 L10.5 12.5 C9.5 13.2, 7.5 13.2, 6.5 12.5 Z" fill="#0B4EA2" />
          {/* White patriarch cross */}
          <rect x="8.2" y="7" width="0.6" height="4.5" fill="#FFFFFF" />
          <rect x="7.3" y="8" width="2.4" height="0.6" fill="#FFFFFF" />
          <rect x="7.6" y="9.3" width="1.8" height="0.5" fill="#FFFFFF" />
        </svg>
      );

    case 'SA':
      // Saudi Arabia: Green with white Arabic script and sword
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="Saudi Arabia flag">
          <rect width="30" height="20" fill="#006C35" />
          {/* Stylized Shahada text line */}
          <path d="M6 7.5 Q15 6 24 7.5 Q15 9 6 7.5 Z" fill="#FFFFFF" opacity="0.9" />
          {/* Sword */}
          <rect x="7" y="11.5" width="15" height="0.8" fill="#FFFFFF" rx="0.4" />
          <polygon points="22,11 24,11.9 22,12.8" fill="#FFFFFF" />
          <rect x="8.5" y="10.5" width="0.8" height="2.8" fill="#FFFFFF" />
        </svg>
      );

    case 'AE':
      // UAE: Red vertical bar on left, Green, White, Black horizontal stripes
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="UAE flag">
          <rect x="7.5" y="0" width="22.5" height="6.67" fill="#00732F" />
          <rect x="7.5" y="6.67" width="22.5" height="6.67" fill="#FFFFFF" />
          <rect x="7.5" y="13.34" width="22.5" height="6.67" fill="#000000" />
          <rect x="0" y="0" width="7.5" height="20" fill="#FF0000" />
        </svg>
      );

    case 'US':
      // United States
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="USA flag">
          <rect width="30" height="20" fill="#B22234" />
          <rect y="1.54" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="4.62" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="7.69" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="10.77" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="13.85" width="30" height="1.54" fill="#FFFFFF" />
          <rect y="16.92" width="30" height="1.54" fill="#FFFFFF" />
          <rect width="12" height="10.77" fill="#3C3B6E" />
          <circle cx="3" cy="3" r="0.8" fill="#FFFFFF" />
          <circle cx="6" cy="3" r="0.8" fill="#FFFFFF" />
          <circle cx="9" cy="3" r="0.8" fill="#FFFFFF" />
          <circle cx="4.5" cy="5.5" r="0.8" fill="#FFFFFF" />
          <circle cx="7.5" cy="5.5" r="0.8" fill="#FFFFFF" />
          <circle cx="3" cy="8" r="0.8" fill="#FFFFFF" />
          <circle cx="6" cy="8" r="0.8" fill="#FFFFFF" />
          <circle cx="9" cy="8" r="0.8" fill="#FFFFFF" />
        </svg>
      );

    case 'CA':
      // Canada
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="Canada flag">
          <rect width="30" height="20" fill="#FF0000" />
          <rect x="7.5" width="15" height="20" fill="#FFFFFF" />
          <path d="M15 4.5 L16.2 8.2 L18.5 7.5 L17.5 9.8 L20 11 L17 12.5 L17.5 14 L15.5 13 L15.3 16 L14.7 16 L14.5 13 L12.5 14 L13 12.5 L10 11 L12.5 9.8 L11.5 7.5 L13.8 8.2 Z" fill="#FF0000" />
        </svg>
      );

    case 'FR':
      // France
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="France flag">
          <rect width="10" height="20" fill="#002654" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#ED2939" />
        </svg>
      );

    case 'GB':
    case 'UK':
      // United Kingdom
      return (
        <svg viewBox="0 0 30 20" className={`${className} inline-block rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} aria-label="UK flag">
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0 L30 20 M30 0 L0 20" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" strokeWidth="2.4" />
          <path d="M15 0 V20 M0 10 H30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M15 0 V20 M0 10 H30" stroke="#C8102E" strokeWidth="3.6" />
        </svg>
      );

    default:
      return (
        <span className="inline-block text-xs leading-none">🌐</span>
      );
  }
}
