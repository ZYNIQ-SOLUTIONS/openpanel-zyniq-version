import { createRemoteJWKSet, jwtVerify } from 'jose';

// ══════════════════════════════════════════════════════════════════
// ZYNIQ Keycloak SSO Integration
// ══════════════════════════════════════════════════════════════════
// This module validates JWT tokens issued by ZYNIQ's Keycloak
// instance. Deploy the /auth service first, then configure
// KEYCLOAK_URL, KEYCLOAK_REALM, and KEYCLOAK_CLIENT_ID.
// ══════════════════════════════════════════════════════════════════

const KEYCLOAK_URL = process.env.KEYCLOAK_URL;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? 'zyniq-studio';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? 'z-openpanel';
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!JWKS) {
    if (!KEYCLOAK_URL || !KEYCLOAK_REALM) {
      throw new Error(
        '[z-openpanel:auth] KEYCLOAK_URL and KEYCLOAK_REALM must be set. ' +
        'Deploy the ZYNIQ /auth service first.',
      );
    }
    const jwksUrl = new URL(
      `/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
      KEYCLOAK_URL,
    );
    JWKS = createRemoteJWKSet(jwksUrl);
  }
  return JWKS;
}

export interface KeycloakUser {
  userId: string;
  email: string;
  name: string;
  preferred_username: string;
  roles: string[];
  raw: Record<string, unknown>;
}

/**
 * Validate a Keycloak-issued JWT access token.
 * Returns user info on success, null on failure.
 */
export async function validateKeycloakToken(
  token: string,
): Promise<KeycloakUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
      audience: KEYCLOAK_CLIENT_ID,
    });

    return {
      userId: payload.sub as string,
      email: (payload as any).email as string,
      name: (payload as any).name as string,
      preferred_username: (payload as any).preferred_username as string,
      roles: ((payload as any).realm_access as any)?.roles ?? [],
      raw: payload as Record<string, unknown>,
    };
  } catch (error) {
    console.error('[z-openpanel:auth] Keycloak token validation failed:', error);
    return null;
  }
}

/**
 * Exchange an authorization code for access + refresh tokens.
 * Used in the OAuth callback route after Keycloak redirects back.
 */
export async function exchangeKeycloakCode(
  code: string,
  redirectUri: string,
): Promise<{
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
} | null> {
  if (!KEYCLOAK_URL || !KEYCLOAK_REALM || !KEYCLOAK_CLIENT_ID) {
    console.error('[z-openpanel:auth] Keycloak not configured for code exchange');
    return null;
  }

  const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: KEYCLOAK_CLIENT_ID,
    ...(KEYCLOAK_CLIENT_SECRET ? { client_secret: KEYCLOAK_CLIENT_SECRET } : {}),
  });

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[z-openpanel:auth] Keycloak token exchange failed:', res.status, err);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('[z-openpanel:auth] Keycloak token exchange error:', error);
    return null;
  }
}

/**
 * Refresh an access token using a refresh token.
 */
export async function refreshKeycloakToken(
  refreshToken: string,
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
} | null> {
  if (!KEYCLOAK_URL || !KEYCLOAK_REALM || !KEYCLOAK_CLIENT_ID) {
    return null;
  }

  const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: KEYCLOAK_CLIENT_ID,
    ...(KEYCLOAK_CLIENT_SECRET ? { client_secret: KEYCLOAK_CLIENT_SECRET } : {}),
  });

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Build the Keycloak logout URL.
 */
export function getKeycloakLogoutUrl(idTokenHint?: string, postLogoutRedirectUri?: string): string {
  const base = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`;
  const params = new URLSearchParams();
  if (idTokenHint) params.set('id_token_hint', idTokenHint);
  if (postLogoutRedirectUri) params.set('post_logout_redirect_uri', postLogoutRedirectUri);
  return params.toString() ? `${base}?${params}` : base;
}

/**
 * Check if Keycloak auth is configured.
 */
export function isKeycloakEnabled(): boolean {
  return !!(KEYCLOAK_URL && KEYCLOAK_REALM && KEYCLOAK_CLIENT_ID);
}
