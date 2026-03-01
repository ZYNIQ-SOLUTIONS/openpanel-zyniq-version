import { createRemoteJWKSet, jwtVerify } from 'jose';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL; // e.g., https://auth.zyniq.cloud
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
    if (!JWKS) {
        if (!KEYCLOAK_URL || !KEYCLOAK_REALM) {
            throw new Error('KEYCLOAK_URL and KEYCLOAK_REALM must be set');
        }
        const jwksUrl = new URL(
            `/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
            KEYCLOAK_URL
        );
        JWKS = createRemoteJWKSet(jwksUrl);
    }
    return JWKS;
}

export async function validateKeycloakToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJWKS(), {
            issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
            audience: KEYCLOAK_CLIENT_ID,
        });

        // Map Keycloak payload to OpenPanel User/Session structure
        return {
            userId: payload.sub as string,
            email: payload.email as string,
            name: payload.name as string,
            preferred_username: payload.preferred_username as string,
            roles: (payload.realm_access as any)?.roles || [],
            raw: payload,
        };
    } catch (error) {
        console.error('Keycloak token validation failed:', error);
        return null;
    }
}
