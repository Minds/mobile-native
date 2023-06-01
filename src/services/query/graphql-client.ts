import { GraphQLClient } from 'graphql-request/.';
import { GRAPHQL_CONFIG } from '~/config/Config';

export const gqlClient = (name: keyof typeof GRAPHQL_CONFIG = 'strapi') =>
  new GraphQLClient(GRAPHQL_CONFIG[name]?.uri, {
    headers: () => ({
      'Content-Type': 'application/json',
      ...(GRAPHQL_CONFIG[name]?.accessToken
        ? {
            authorization: `Bearer ${GRAPHQL_CONFIG[name].accessToken}`,
          }
        : {}),
    }),
  });
