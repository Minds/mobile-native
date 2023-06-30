import type { CodegenConfig } from '@graphql-codegen/cli';

const MINDS_API_URI = 'https://www.minds.com/api/graphql';
const STRAPI_API_URI = 'https://cms.minds.com/graphql';
// const STRAPI_API_URI = 'https://cms.oke.minds.io/graphql';
// const STRAPI_API_URI = 'http://localhost:1337/graphql';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  'no-cache': '1',
};

const queryPlugins = [
  'typescript',
  'typescript-operations',
  'typescript-react-query',
];

/**
 * GraphQL Codegen configuration.
 */

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/strapi.ts': {
      schema: './gql-schemas/strapi.schema.json',
      documents: ['src/**/*.strapi.graphql'],
      plugins: queryPlugins,
      config: {
        namedClient: 'strapi',
        fetcher: {
          endpoint: STRAPI_API_URI,
          fetchParams: {
            headers: defaultHeaders,
          },
        },
      },
    },
    './src/graphql/api.ts': {
      schema: './gql-schemas/api.schema.json',
      documents: ['src/**/*.api.graphql', '!src/gql/**/*'],
      plugins: queryPlugins,
      config: {
        namedClient: 'default',
        fetcher: {
          func: '~/common/services/api.service#gqlFetcher',
          isReactHook: false,
        },
        addInfiniteQuery: true,
        exposeFetcher: true,
      },
    },
    // INTROSPECTION
    './gql-schemas/api.schema.json': {
      schema: {
        [MINDS_API_URI]: {
          headers: { ...defaultHeaders, Cookie: 'staging=1' },
        },
      },
      plugins: ['introspection'],
    },
    // uncomment below if you want to run introspection on strapi
    // './gql-schemas/strapi.schema.json': {
    //   schema: { [STRAPI_API_URI]: { headers: defaultHeaders } },
    //   plugins: ['introspection'],
    // },
  },
};

export default config;
