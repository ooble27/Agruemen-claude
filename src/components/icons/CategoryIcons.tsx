type IconProps = { size?: number; className?: string };

const base = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconTous = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8"/>
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

export const IconFruits = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 5C12 5 13.5 2 17 2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 5v8M6.4 9.8l11.2 6.4M17.6 9.8L6.4 16.2" stroke="currentColor" strokeWidth="1.4" opacity="0.6"/>
  </svg>
);

export const IconLegumes = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21C12 21 5 16 5 10a7 7 0 0114 0c0 6-7 11-7 11z" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 10L8 6M12 10l4-4M12 10v5" stroke="currentColor" strokeWidth="1.4" opacity="0.65"/>
    <path d="M9 13a4 4 0 006 0" stroke="currentColor" strokeWidth="1.4" opacity="0.5"/>
  </svg>
);

export const IconCereales = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 20V8" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 8C12 8 8 7 7 4c3 0 5 2 5 4z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 8C12 8 16 7 17 4c-3 0-5 2-5 4z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 12C12 12 8 11 7 8c3 0 5 2 5 4z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 12C12 12 16 11 17 8c-3 0-5 2-5 4z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 16C12 16 9 15 8 12c3 0 4 2 4 4z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 16C12 16 15 15 16 12c-3 0-4 2-4 4z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15"/>
  </svg>
);

export const IconEpices = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <path d="M14 2c0 0 1 2 0 4-1 1-2 0-3 1-2 2-2 5-1 8 1 2 3 4 3 6" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 2c2 0 4 1 4 3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M10 7C8 8 6 12 7 16c1 3 3 5 3 5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M13 21c0 0-2 0-3-5" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
  </svg>
);

export const IconTubercules = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <ellipse cx="12" cy="12" rx="8" ry="6.5" stroke="currentColor" strokeWidth="1.8" transform="rotate(-15 12 12)"/>
    <path d="M10 5.5c0 0-1-2 1-3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M16 8c0 0 2-1 3 1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 16c0 0-1 2-3 1" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/>
    <circle cx="15.5" cy="13" r="1" stroke="currentColor" strokeWidth="1.2" opacity="0.4"/>
  </svg>
);

export const IconHerbes = ({ size = 18, className = "" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21V13" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 17C12 17 9 16 8 13c2.5 0 4 2 4 4z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.18"/>
    <path d="M12 17C12 17 15 16 16 13c-2.5 0-4 2-4 4z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.18"/>
    <path d="M12 13C12 13 8 11 8 7c3.5 0 4 3 4 6z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.2"/>
    <path d="M12 13C12 13 16 11 16 7c-3.5 0-4 3-4 6z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.2"/>
    <path d="M12 7C12 7 11 4 12 2c1 2 0 5 0 5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.25"/>
  </svg>
);

export const CATEGORY_ICON_MAP: Record<string, (props: IconProps) => JSX.Element> = {
  fruits:     IconFruits,
  legumes:    IconLegumes,
  cereales:   IconCereales,
  epices:     IconEpices,
  tubercules: IconTubercules,
  herbes:     IconHerbes,
};

export const getCategoryIcon = (key: string | null, props?: IconProps) => {
  if (!key) return <IconTous {...props} />;
  const Icon = CATEGORY_ICON_MAP[key] ?? IconHerbes;
  return <Icon {...props} />;
};
