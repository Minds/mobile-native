import type { CodegenConfig } from '@graphql-codegen/cli';
import { mindsSchema, strapiSchema } from './default.codegen';
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

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
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
    './src/graphql/apollo.api.ts': {
      ...mindsSchema,
      plugins: apolloPlugins,
      config: apolloConfig,
    },
    // INTROSPECTION
    './graphqlql.api.schema.json': {
      ...mindsSchema,
      plugins: ['introspection'],
    },
    // need to run the strapi locally until strapi introspection is fixed
    './graphqlql.strapi.schema.json': {
      ...strapiSchema,
      plugins: ['introspection'],
    },
  },
};

export default config;
