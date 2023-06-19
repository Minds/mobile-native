import type { CodegenConfig } from '@graphql-codegen/cli';
import {
  MINDS_API_URI,
  STRAPI_API_URI,
  defaultHeaders,
  mindsSchema,
  strapiSchema,
} from './default.codegen';

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
    // INTROSPECTION
    './graphqlql.api.schema.json': {
      ...mindsSchema,
      plugins: ['introspection'],
    },
    // comment below if introspection is not yet working on strapi
    // './graphqlql.strapi.schema.json': {
    //   ...strapiSchema,
    //   plugins: ['introspection'],
    // },
  },
};

export default config;
