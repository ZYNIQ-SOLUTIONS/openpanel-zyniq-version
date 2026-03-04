import * as controller from '@/controllers/oauth-callback.controller';
import * as keycloakController from '@/controllers/keycloak-callback.controller';
import type { FastifyPluginCallback } from 'fastify';

const router: FastifyPluginCallback = async (fastify) => {
  // GitHub OAuth
  fastify.route({
    method: 'GET',
    url: '/github/callback',
    handler: controller.githubCallback,
  });

  // Google OAuth
  fastify.route({
    method: 'GET',
    url: '/google/callback',
    handler: controller.googleCallback,
  });

  // Keycloak SSO (ZYNIQ Auth Service)
  fastify.route({
    method: 'GET',
    url: '/keycloak/callback',
    handler: keycloakController.keycloakCallback,
  });

  fastify.route({
    method: 'GET',
    url: '/keycloak/logout',
    handler: keycloakController.keycloakLogout,
  });
};

export default router;
