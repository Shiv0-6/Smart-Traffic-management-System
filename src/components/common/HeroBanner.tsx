import React from 'react';

type BannerTone = 'primary' | 'accent' | 'success' | 'warning' | 'default';

interface HeroBannerProps {
  imageSrc?: string; // optional hero image; if omitted, show a gradient backdrop
  heightClass?: string; // e.g., 'h-48 md:h-64'
  badges?: Array<{ label: string; tone?: BannerTone }>;
  overlay?: boolean;
  className?: string;
}

const badgeToneToClasses = (tone?: BannerTone) => {
  switch (tone) {
    case 'primary':
      return 'border-primary/30 bg-primary/10 text-primary';
    case 'accent':
      return 'border-accent/30 bg-accent/10 text-accent';
    case 'success':
      return 'border-success/30 bg-success/10 text-success';
    case 'warning':
      return 'border-warning/30 bg-warning/10 text-warning';
    default:
      return 'border-border/40 bg-background/50';
  }
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  imageSrc,
  heightClass = 'h-48 md:h-64',
  badges = [],
  overlay = true,
  className = '',
}) => {
  return (
    <div className={`relative rounded-xl overflow-hidden border border-primary/20 shadow-lg ${className}`}>
      {imageSrc ? (
        <img src={imageSrc} alt="Hero banner" className={`w-full ${heightClass} object-cover`} />
      ) : (
        <div className={`w-full ${heightClass} bg-gradient-to-r from-primary/10 via-accent/10 to-background`} />
      )}
      {overlay && imageSrc && (
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/30 to-transparent" />
      )}
      {badges.length > 0 && (
        <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
          {badges.map((b, i) => (
            <span
              key={`${b.label}-${i}`}
              className={`px-2 py-1 text-xs rounded-md border ${badgeToneToClasses(b.tone)}`}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
