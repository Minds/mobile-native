import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      'https://cms.oke.minds.io/graphql': {
        headers: {},
      },
    },
  ],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      documents: ['src/**/*.tsx', '!src/gql/**/*'],
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
