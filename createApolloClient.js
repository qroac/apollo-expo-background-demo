import fetch from 'cross-fetch';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { LoggingLink } from './apolloLogger';
import { ApolloClient, InMemoryCache, ApolloLink, InMemoryCacheConfig, ApolloClientOptions } from '@apollo/client';
import log from './log';

const createApolloClient = async ({
  apiUrl,
}) => {
  const cache = new InMemoryCache();
  const queryLink = new BatchHttpLink({
        uri: apiUrl,
        credentials: 'include',
        fetch,
        cache: new InMemoryCache(),
      });

  const allLinks = [
    queryLink,
  ];

  allLinks.unshift(new LoggingLink({ logger: log.debug.bind(log) }));

  const clientParams = {
    link: ApolloLink.from(allLinks),
    cache,
  };

  const client = new ApolloClient(clientParams);

  if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__);
  }

  return client;
};

export default createApolloClient;
