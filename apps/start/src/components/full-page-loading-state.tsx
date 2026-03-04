/**
 * ZYNIQ Cloud Analytics — Full Page Loading State
 * Uses the animated Z sign logo from the ZYNIQ design system.
 * This replaces the generic spinner with branded loading UX.
 */

const FullPageLoadingState = ({
  title = 'Loading…',
  description = 'Preparing your analytics dashboard…',
}: { title?: string; description?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.16))] gap-6 animate-in fade-in duration-300">
      {/* Animated Z Sign Logo */}
      <div className="relative inline-flex items-center justify-center">
        {/* Pulse rings */}
        <div
          className="absolute rounded-full border border-red-500/15"
          style={{
            inset: '-12px',
            animation: 'zyniqRingPulse 1.8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full border border-red-500/10"
          style={{
            inset: '-22px',
            animation: 'zyniqRingPulse 1.8s ease-in-out 0.4s infinite',
          }}
        />
        <svg
          className="w-12 h-11"
          viewBox="-200 -200 1305 1209"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 16px rgba(234,35,35,0.35))' }}
        >
          <path
            fill="#EA2323"
            d="M768.056 372.62H896.556C879.556 353.62 903.111 388.25 715.056 147.62C668.556 88.1205 705.556 135.12 609.556 6.62048L437.056 3.62048C474.086 55.3364 701.056 372.62 701.056 372.62C701.056 372.62 713.094 371.745 768.056 372.62Z"
            style={{ animation: 'zyniqFadeScale 1.2s ease-out forwards' }}
          />
          <path
            fill="#EA2323"
            d="M415.444 374.052C476.678 371.602 549.763 373.071 611.955 372.93C518.312 472.449 395.054 575.499 306.297 678.444C463.296 680.817 621.487 677.151 778.582 678.297C808.419 678.514 837.008 676.704 866.911 679.16C824.898 720.601 791.271 760.691 751.023 802.889C736.966 806.326 586.131 802.202 560.024 802.543C378.184 804.916 188.275 797.473 7.05566 804.546C53.6786 740.135 154.944 646.625 210.364 585.95C238.652 554.978 392.759 384.773 415.444 374.052Z"
            style={{ animation: 'zyniqFadeScale 1.2s ease-out 0.2s forwards' }}
          />
        </svg>
      </div>

      {/* Micro spinner */}
      <div
        className="w-5 h-5 rounded-full border-2 border-red-500/15 border-t-red-500"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />

      {/* Text */}
      <div className="text-center space-y-1">
        {title && <p className="text-sm font-medium text-foreground">{title}</p>}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      {/* Inline keyframes for the ZYNIQ animations */}
      <style>{`
        @keyframes zyniqRingPulse {
          0%   { opacity: 0; transform: scale(0.9); }
          50%  { opacity: 0.6; transform: scale(1.08); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        @keyframes zyniqFadeScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoadingState;
