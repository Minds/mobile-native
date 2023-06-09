import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/strapi.ts': {
      // PRODUCTION
      // schema: 'https://cms.minds.com/graphql',
      // STAGING
      // schema: 'https://cms.oke.minds.io/graphql',
      schema: 'http://127.0.0.1:1337/graphql',
      documents: ['src/**/*.strapi.graphql'],
      // preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        namedClient: 'strapi',
        fetcher: {
          // from environment
          // endpoint: 'process.env.STRAPI_ENDPOINT',
          endpoint: 'https://cms.oke.minds.io/graphql',
          fetchParams: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      },
    },
    './src/graphql/apollo.strapi.ts': {
      schema: 'http://127.0.0.1:1337/graphql',
      documents: ['src/**/*.strapi.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withMutationFn: true,
        withRefreshFn: true,
        defaultBaseOptions: {
          context: {
            clientName: 'strapi',
          },
        },
      },
    },
    './graphqlql.strapi.schema.json': {
      schema: 'http://127.0.0.1:1337/graphql',
      plugins: ['introspection'],
    },
    './src/graphql/api.ts': {
      schema: {
        'https://www.minds.com/api/graphql': {
          headers: {
            Cookie: 'staging=1',
          },
        },
      },
      documents: ['src/**/*.api.graphql', '!src/gql/**/*'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        namedClient: 'default',
        fetcher: {
          endpoint: 'https://www.minds.com/api/graphql',
          fetchParams: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
        addInfiniteQuery: true,
      },
    },
    './src/graphql/apollo.api.ts': {
      schema: {
        'https://www.minds.com/api/graphql': {
          headers: {
            Cookie: 'staging=1',
          },
        },
      },
      documents: ['src/**/*.api.graphql', '!src/gql/**/*'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withMutationFn: true,
        withRefreshFn: true,
      },
    },
    './graphqlql.api.schema.json': {
      schema: {
        'https://www.minds.com/api/graphql': {
          headers: {
            Cookie: 'staging=1',
          },
        },
      },
      plugins: ['introspection'],
    },
  },
};

export default config;
