import { LogError } from '@/utils/errors';
import {
  createSession,
  exchangeKeycloakCode,
  generateSessionToken,
  isKeycloakEnabled,
  setSessionTokenCookie,
  validateKeycloakToken,
  getKeycloakLogoutUrl,
} from '@openpanel/auth';
import { connectUserToOrganization, db } from '@openpanel/db';
import type { FastifyReply, FastifyRequest } from 'fastify';

// ══════════════════════════════════════════════════════════════════
// Keycloak SSO Callback Controller
// ══════════════════════════════════════════════════════════════════
// Handles the OAuth2 authorization code flow callback from ZYNIQ
// Keycloak. Creates or links users and establishes sessions.
// ══════════════════════════════════════════════════════════════════

/**
 * GET /oauth/keycloak/callback?code=...&state=...
 * Handles the Keycloak authorization code callback.
 */
export async function keycloakCallback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!isKeycloakEnabled()) {
    return reply.status(501).send({
      error: 'Keycloak SSO is not configured. Deploy the ZYNIQ /auth service first.',
    });
  }

  const { code, state } = request.query as { code?: string; state?: string };

  if (!code) {
    return reply.redirect(
      `${dashboardUrl()}/login?error=${encodeURIComponent('Missing authorization code from Keycloak')}`,
    );
  }

  try {
    // Exchange the authorization code for tokens
    const redirectUri = `${apiUrl()}/oauth/keycloak/callback`;
    const tokens = await exchangeKeycloakCode(code, redirectUri);

    if (!tokens) {
      return reply.redirect(
        `${dashboardUrl()}/login?error=${encodeURIComponent('Failed to exchange Keycloak token')}`,
      );
    }

    // Validate the access token and extract user info
    const keycloakUser = await validateKeycloakToken(tokens.access_token);
    if (!keycloakUser) {
      return reply.redirect(
        `${dashboardUrl()}/login?error=${encodeURIComponent('Invalid Keycloak token')}`,
      );
    }

    // Find or create user in the local database
    const existingAccount = await db.account.findFirst({
      where: {
        OR: [
          { provider: 'keycloak', providerId: keycloakUser.userId },
          { email: keycloakUser.email },
        ],
      },
    });

    let userId: string;

    if (existingAccount) {
      // Update the account with Keycloak details
      await db.account.update({
        where: { id: existingAccount.id },
        data: {
          provider: 'keycloak',
          providerId: keycloakUser.userId,
          email: keycloakUser.email,
        },
      });
      userId = existingAccount.userId;
    } else {
      // Check if user exists by email
      const existingUser = await db.user.findFirst({
        where: { email: keycloakUser.email },
      });

      if (existingUser) {
        // Link existing user to Keycloak account
        await db.account.create({
          data: {
            userId: existingUser.id,
            provider: 'keycloak',
            providerId: keycloakUser.userId,
            email: keycloakUser.email,
          },
        });
        userId = existingUser.id;
      } else {
        // Create new user + account + default organization
        const nameParts = (keycloakUser.name || keycloakUser.preferred_username || '').split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        const user = await db.user.create({
          data: {
            email: keycloakUser.email,
            firstName,
            lastName,
          },
        });

        await db.account.create({
          data: {
            userId: user.id,
            provider: 'keycloak',
            providerId: keycloakUser.userId,
            email: keycloakUser.email,
          },
        });

        // Create default organization for new user
        const org = await db.organization.create({
          data: {
            name: `${firstName}'s Organization`,
          },
        });
        await connectUserToOrganization(user.id, org.id, 'admin');

        userId = user.id;
      }
    }

    // Create session
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, userId);

    setSessionTokenCookie(
      (...args: any[]) => (reply as any).setCookie(...args),
      sessionToken,
      session.expiresAt,
    );

    return reply.redirect(dashboardUrl());
  } catch (error) {
    console.error('[z-openpanel:keycloak] Callback error:', error);
    const correlationId = crypto.randomUUID();
    return reply.redirect(
      `${dashboardUrl()}/login?error=${encodeURIComponent('SSO authentication failed')}&correlationId=${correlationId}`,
    );
  }
}

/**
 * GET /oauth/keycloak/logout
 * Redirects to Keycloak logout then back to dashboard.
 */
export async function keycloakLogout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const logoutUrl = getKeycloakLogoutUrl(undefined, dashboardUrl());
  return reply.redirect(logoutUrl);
}

function dashboardUrl(): string {
  return process.env.DASHBOARD_URL || process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
}

function apiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
}
