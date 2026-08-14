import type { JSX, ReactNode } from "react";

interface IconProps {
  className?: string;
}

function IconShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Sparkles   animated web pages */
export function IconAnimatedPages({ className }: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m6.5 6.5 2 2" />
      <path d="m15.5 15.5 2 2" />
      <path d="m6.5 17.5 2-2" />
      <path d="m15.5 8.5 2-2" />
      <circle cx="12" cy="12" r="2.5" />
    </IconShell>
  );
}

/** Browser window   web pages */
export function IconWebPages({ className }: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.25" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.75" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="11.25" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

/** Target   landing pages */
export function IconLandingPages({ className }: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

/** Phone   mobile apps */
export function IconMobileApps({ className }: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 6h2" />
      <path d="M11 18.5h2" />
    </IconShell>
  );
}

/** Puzzle   personalized software */
export function IconPersonalizedSoftware({
  className,
}: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <path d="M10 4a2 2 0 0 1 4 0v1.2h2.2A2.3 2.3 0 0 1 18.5 7.5V10H19.5a2 2 0 1 1 0 4H18.5v2.5A2.3 2.3 0 0 1 16.2 19H14v1a2 2 0 1 1-4 0v-1H7.8A2.3 2.3 0 0 1 5.5 16.5V14H4.5a2 2 0 1 1 0-4H5.5V7.5A2.3 2.3 0 0 1 7.8 5.2H10V4Z" />
    </IconShell>
  );
}

/** Storefront   shops */
export function IconShops({ className }: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <path d="M4 10.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-8.5" />
      <path d="M3.5 7.5 5 4h14l1.5 3.5v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0v-2Z" />
      <path d="M10 21v-6h4v6" />
    </IconShell>
  );
}

/** Bot   AI agents */
export function IconAiAgents({ className }: IconProps): JSX.Element {
  return (
    <IconShell className={className}>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 4v4" />
      <circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <path d="M9.5 16.5h5" />
      <path d="M3.5 12.5H5" />
      <path d="M19 12.5h1.5" />
    </IconShell>
  );
}
