export const MINDS_API_URI = 'https://www.minds.com/api/graphql';
// export const STRAPI_API_URI = 'https://cms.oke.minds.io/graphql';
// export const STRAPI_API_URI = 'https://cms.minds.com/graphql';
export const STRAPI_API_URI = 'http://localhost:1337/graphql';

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  'no-cache': '1',
};

export const mindsSchema = {
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

export const strapiSchema = {
  // schema: './graphqlql.strapi.schema.json',
  schema: { [STRAPI_API_URI]: { headers: defaultHeaders } },
  documents: ['src/**/*.strapi.graphql'], //, '!src/gql/twitterSync*'],
};
