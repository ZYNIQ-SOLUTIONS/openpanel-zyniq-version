import { cn } from '@/utils/cn';

// Brand assets sourced from z-framework.manifest.json (ZYNIQ brand)
const BRAND = {
  logoIcon:
    'https://core.zyniq.solutions/cdn/file/zyniqsolutionsbucket/brand-assets/GRAY_SIGN_LOGO%2BCLOUD_LOGO+(1).png',
  logoIconText:
    'https://core.zyniq.solutions/cdn/file/zyniqsolutionsbucket/brand-assets/CLOUD_LOGO%2BTEXT.png',
  siteUrl: 'https://zyniq.solutions',
} as const;

interface LogoProps {
  className?: string;
}

export function LogoSquare({ className }: LogoProps) {
  return (
    <img
      src={BRAND.logoIcon}
      className={cn('object-contain', className)}
      alt="Zyniq Solutions logo"
    />
  );
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-xl font-medium', className)}
    >
      <img
        src={BRAND.logoIconText}
        className="max-h-8 object-contain"
        alt="Zyniq Solutions"
      />
    </div>
  );
}
