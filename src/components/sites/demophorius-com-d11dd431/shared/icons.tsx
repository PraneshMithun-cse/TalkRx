const ASSET_BASE = "/sites/demophorius-com-d11dd431/root-8a5edab2";

export function TalkRxWordmark({ className }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-1.5 font-bold tracking-tight select-none ${className || ""}`}>
      <span className="text-2xl md:text-3xl font-black text-neutral-950 tracking-[-0.03em]">
        Talk<span className="text-blue-600">Rx</span>
      </span>
    </div>
  );
}

export function AyushBadge({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/70 px-3 py-1 text-xs backdrop-blur-sm shadow-sm ${className || ""}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-bold text-emerald-800 tracking-wider uppercase text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
        Ministry of Ayush
      </span>
    </div>
  );
}

export function DemophoriusWordmark({ className }: { className?: string }) {
  return <TalkRxWordmark className={className} />;
}

export function LoginIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 25" fill="currentColor" aria-hidden="true">
      <path d="M25.865,23.499c-1.908-3.296-4.848-5.654-8.276-6.771,2.636-1.571,4.411-4.443,4.411-7.728C22,4.038,17.963,0,13,0S4,4.038,4,9c0,3.286,1.775,6.157,4.411,7.728-3.429,1.116-6.369,3.475-8.277,6.771-.276.479-.113,1.09.365,1.366.158.092.33.135.5.135.345,0,.681-.179.867-.499,2.355-4.07,6.518-6.501,11.134-6.501s8.778,2.431,11.135,6.501c.277.478.888.642,1.366.364.478-.276.642-.889.364-1.366ZM6,9c0-3.86,3.14-7,7-7s7,3.14,7,7-3.141,7-7,7-7-3.14-7-7Z" />
    </svg>
  );
}

export function HamburgerIcon({ className }: { className?: string }) {
  return (
    <div className={className}>
      <span className="block h-[2px] w-full bg-current" />
      <span className="block h-[2px] w-full bg-current" />
      <span className="block h-[2px] w-full bg-current" />
    </div>
  );
}

export function ArrowDiagonalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      x="0px"
      y="0px"
      viewBox="0 0 98.3 98.2"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="13.5,4.1 91.1,4.1 0,95.2 2.9,98.1 94,7 94,84.6 98.1,84.6 98.1,0 13.5,0 " />
    </svg>
  );
}

export function CircleArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} x="0px" y="0px" viewBox="0 0 95.7 95.8" fill="currentColor" aria-hidden="true">
      <polygon points="47.2,40.4 53.4,46.6 37.3,46.6 37.3,49.2 53.4,49.2 47.2,55.4 49.1,57.2 58.4,47.9 49.1,38.5 " />
    </svg>
  );
}

export function CircleArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 95.7 95.8" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="47.8" cy="47.9" r="47.1" />
      <polygon
        fill="currentColor"
        stroke="none"
        points="40.4,48.5 46.5,42.4 46.5,58.4 49.2,58.4 49.2,42.4 55.3,48.5 57.2,46.7 47.8,37.3 38.5,46.7 "
        transform="matrix(1.2,0,0,1.2,-9.57,-9.57)"
      />
    </svg>
  );
}

export function CircleArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} x="0px" y="0px" viewBox="0 0 95.7 95.8" aria-hidden="true">
      <circle cx="47.8" cy="47.9" r="47.1" fill="none" stroke="currentColor" strokeWidth="1" />
      <polygon
        fill="currentColor"
        points="48.5,55.4 42.3,49.2 58.4,49.2 58.4,46.6 42.3,46.6 48.5,40.4 46.6,38.5 37.3,47.9 46.6,57.2 "
      />
    </svg>
  );
}

export function CircleDotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} x="0px" y="0px" viewBox="0 0 278.1 278.1" fill="currentColor" aria-hidden="true">
      <circle cx="30.34" cy="139" r="30.34" />
      <circle cx="138.92" cy="139" r="30.34" />
      <circle cx="247.76" cy="139" r="30.34" />
    </svg>
  );
}

export function TimelineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 278.1 278.1" aria-hidden="true">
      <circle cx="139" cy="139" r="135.8" fill="none" stroke="currentColor" strokeWidth="5.5" />
      <g fill="currentColor">
        <circle cx="98.2" cy="139" r="11.4" />
        <circle cx="139" cy="139" r="11.4" />
        <circle cx="179.9" cy="139" r="11.4" />
      </g>
    </svg>
  );
}

export const BRAND_LOGOS = {
  demotek: `${ASSET_BASE}/icons/logo-demotek.svg`,
  dtek: `${ASSET_BASE}/icons/logo-dtek.svg`,
  dvac: `${ASSET_BASE}/icons/logo-dvac.svg`,
  dmach: `${ASSET_BASE}/icons/logo-dmach.svg`,
  demoflush: `${ASSET_BASE}/icons/logo-demoflush.svg`,
} as const;

export const SOCIAL_ICONS = {
  instagram: `${ASSET_BASE}/icons/social-instagram.svg`,
  facebook: `${ASSET_BASE}/icons/social-facebook.svg`,
  linkedin: `${ASSET_BASE}/icons/social-linkedin.svg`,
} as const;

export const LAB_ICON_SRC = `${ASSET_BASE}/icons/laboratory.svg`;
export const REDDOT_30YEARS_SRC = `${ASSET_BASE}/images/30-years-badge.svg`;
export const REDDOT_AWARD_BLACK_SRC = `${ASSET_BASE}/images/reddot-award-black.png`;
export const REDDOT_AWARD_WHITE_SRC = `${ASSET_BASE}/images/reddot-award-white.png`;
