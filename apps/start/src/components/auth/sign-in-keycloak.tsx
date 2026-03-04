import { Button } from '../ui/button';

/**
 * Sign-in with ZYNIQ SSO (Keycloak).
 * Redirects the browser to the Keycloak authorization endpoint.
 * This is the PRIMARY auth method for ZYNIQ Cloud Analytics.
 */
export function SignInKeycloak({
  type,
}: { type: 'sign-in' | 'sign-up' }) {
  const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
  const realm = import.meta.env.VITE_KEYCLOAK_REALM || 'zyniq-studio';
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'z-openpanel';

  const isEnabled = !!(keycloakUrl && realm && clientId);

  const handleClick = () => {
    if (!isEnabled) return;

    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || '';
    const redirectUri = encodeURIComponent(`${apiUrl}/oauth/keycloak/callback`);
    const state = crypto.randomUUID(); // CSRF protection

    // Store state for verification
    sessionStorage.setItem('kc_oauth_state', state);

    window.location.href =
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&state=${state}`;
  };

  if (!isEnabled) return null;

  const title = type === 'sign-in' ? 'Sign in with ZYNIQ SSO' : 'Sign up with ZYNIQ SSO';

  return (
    <Button
      className="w-full bg-[#EA2323] hover:bg-[#cc1f1f] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold [&_svg]:shrink-0"
      size="lg"
      onClick={handleClick}
    >
      {/* ZYNIQ Z sign icon */}
      <svg
        className="size-5 mr-2"
        viewBox="-200 -200 1305 1209"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M768.056 372.62H896.556C879.556 353.62 903.111 388.25 715.056 147.62C668.556 88.1205 705.556 135.12 609.556 6.62048L437.056 3.62048C474.086 55.3364 701.056 372.62 701.056 372.62C701.056 372.62 713.094 371.745 768.056 372.62Z" />
        <path d="M137.556 441.12H0.0556641L0.0556165 441.119C0.0556552 441.119 202.556 699.319 326.356 871.62C441.556 1031.62 396.856 971.62 500.556 1116.62L637.056 1116.62C637.056 1116.62 380.556 753.12 204.556 517.62C190.256 498.52 170.556 470.12 137.556 441.12Z" />
      </svg>
      {title}
    </Button>
  );
}
