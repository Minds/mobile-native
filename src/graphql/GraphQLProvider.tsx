import { PropsWithChildren } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { GRAPHQL_CONFIG, USE_APOLLO } from '~/config/Config';

const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'strapi',
    new HttpLink({
      ...GRAPHQL_CONFIG.strapi,
    }),
    new HttpLink({
      ...GRAPHQL_CONFIG.minds,
    }),
  ),
  cache: new InMemoryCache(),
});

export const GraphQLProvider = ({ children }: PropsWithChildren) =>
  USE_APOLLO ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <>{children}</>
  );
