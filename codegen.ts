import type { CodegenConfig } from '@graphql-codegen/cli';

const MINDS_API_URI = 'https://www.minds.com/api/graphql';
const STRAPI_API_URI = 'https://cms.minds.com/graphql';
// use this for sandbox
// const STRAPI_API_URI = 'https://cms.oke.minds.io/graphql';
// use this for local development
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

const strapi_schema = {
  schema: { [STRAPI_API_URI]: { headers: defaultHeaders } },
};
const api_schema = {
  schema: {
    [MINDS_API_URI]: {
      headers: { ...defaultHeaders, Cookie: 'staging=1' },
    },
  },
};

/**
 * GraphQL Codegen configuration.
 */

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/strapi.ts': {
      // use this if introspection fails and comment ...strapi_schema
      // schema: './gql-schemas/strapi.schema.json',
      ...strapi_schema,
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
      // use this if introspection fails and comment ...api_schema
      // schema: './gql-schemas/api.schema.json',
      ...api_schema,
      documents: ['src/**/*.api.graphql'],
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
      ...api_schema,
      plugins: ['introspection'],
    },
    './gql-schemas/strapi.schema.json': {
      ...strapi_schema,
      plugins: ['introspection'],
    },
  },
};

export default config;
