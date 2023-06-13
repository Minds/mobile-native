import type { CodegenConfig } from '@graphql-codegen/cli';

const MINDS_API_URI = 'https://www.minds.com/api/graphql';
const STRAPI_API_URI = 'https://cms.oke.minds.io/graphql'; // 'https://cms.minds.com/graphql';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  'no-cache': '1',
};

const mindsSchema = {
  schema: {
    [MINDS_API_URI]: {
      headers: {
        ...defaultHeaders,
        Cookie: 'staging=1',
      },
    },
  },
  documents: ['src/**/*.api.graphql', '!src/gql/**/*'],
};

const strapiSchema = {
  // schema: { [STRAPI_API_URI]: { headers: defaultHeaders } },
  schema: './graphqlql.strapi.schema.json',
  documents: ['src/**/*.strapi.graphql', '!src/gql/twitterSync*'],
};

const queryPlugins = [
  'typescript',
  'typescript-operations',
  'typescript-react-query',
];

/**
 * Apollo Codegen configuration.
 */

const apolloPlugins = [
  'typescript',
  'typescript-operations',
  'typescript-react-apollo',
];

const apolloConfig = {
  withHooks: true,
  withMutationFn: true,
  withRefreshFn: true,
};

const apolloStrapi = {
  './src/graphql/apollo.strapi.ts': {
    ...strapiSchema,
    plugins: apolloPlugins,
    config: {
      ...apolloConfig,
      defaultBaseOptions: {
        context: {
          clientName: 'strapi',
        },
      },
    },
  },
};

const apolloMinds = {
  './src/graphql/apollo.api.ts': {
    ...mindsSchema,
    plugins: apolloPlugins,
    config: apolloConfig,
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
      ...strapiSchema,
      plugins: queryPlugins,
      config: {
        namedClient: 'strapi',
        fetcher: {
          endpoint: STRAPI_API_URI, // or 'process.env.STRAPI_ENDPOINT'
          fetchParams: {
            headers: defaultHeaders,
          },
        },
      },
    },
    './src/graphql/api.ts': {
      ...mindsSchema,
      plugins: queryPlugins,
      config: {
        namedClient: 'default',
        fetcher: {
          endpoint: MINDS_API_URI,
          fetchParams: {
            headers: defaultHeaders,
            Cookie: 'staging=1',
          },
        },
        addInfiniteQuery: true,
      },
    },
    ...apolloStrapi,
    ...apolloMinds,
    // INTROSPECTION
    './graphqlql.api.schema.json': {
      ...mindsSchema,
      plugins: ['introspection'],
    },
    // need to run the strapi locally until strapi introspection is fixed
    // './graphqlql.strapi.schema.json': {
    //   schema: 'http://127.0.0.1:1337/graphql',
    //   plugins: ['introspection'],
    // },
  },
};

export default config;
