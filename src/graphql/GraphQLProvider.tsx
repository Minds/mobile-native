import { PropsWithChildren } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { USE_APOLLO } from '~/config/Config';
import { Version } from '~/config/Version';
import sessionService from '~/common/services/session.service';

const client = () =>
  new ApolloClient({
    link: ApolloLink.split(
      operation => operation.getContext().clientName === 'strapi',
      new HttpLink(getGraphQLConfig({ host: 'strapi' })),
      new HttpLink(
        getGraphQLConfig({ accessToken: sessionService.getAccessTokenFrom(0) }),
      ),
    ),
    cache: new InMemoryCache(),
  });

export const GraphQLProvider = ({ children }: PropsWithChildren) =>
  USE_APOLLO ? (
    <ApolloProvider client={client()}>{children}</ApolloProvider>
  ) : (
    <>{children}</>
  );

type GraphQLConfigParams = {
  host?: 'minds' | 'strapi';
  accessToken?: string;
};
const getGraphQLConfig = ({
  host = 'minds',
  accessToken,
}: GraphQLConfigParams) => {
  return {
    uri: host === 'strapi' ? STRAPI_API_URI : MINDS_API_URI,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      'no-cache': '1',
      'App-Version': Version.VERSION,
      ...(host === 'minds' ? { Cookie: 'staging=1' } : undefined),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  };
};

const MINDS_API_URI = 'https://www.minds.com/api/graphql';
const STRAPI_API_URI = 'https://cms.oke.minds.io/graphql'; // 'https://cms.minds.com/graphql';
