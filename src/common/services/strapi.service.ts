import { STRAPI_API_URI } from '~/config/Config';

export const gqlFetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers'],
): (() => Promise<TData>) => {
  return async () => {
    const res = await fetch(STRAPI_API_URI, {
      method: 'POST',
      ...{
        headers: {
          'Content-Type': 'application/json',
          // TO BE USED IN DEVELOPMENT
          // 'Cache-Control': 'no-cache, no-store, must-revalidate',
          // Pragma: 'no-cache',
          // 'no-cache': '1',
          ...options,
        },
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors) {
      const { message } = json.errors[0];
      throw new Error(message);
    }
    return json.data;
  };
};
