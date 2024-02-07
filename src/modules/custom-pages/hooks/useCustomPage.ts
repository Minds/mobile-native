import { useGetCustomPageQuery } from '~/graphql/api';
import { CustomPageType } from '../types';
import { useMemo } from 'react';

/**
 * Returns the custom page content for the given page type.
 */
export default function useCustomPage(pageType?: CustomPageType) {
  const { data, isLoading, error } = useGetCustomPageQuery(
    {
      pageType: pageType || '',
    },
    { enabled: !!pageType },
  );

  const customPage = useMemo(() => {
    if (data && data.customPage) {
      return {
        content: data.customPage.content || getDefault(pageType || ''),
        externalLink: data.customPage.externalLink,
      };
    }

    return null;
  }, [data, pageType]);

  return { customPage, isLoading, error };
}

function getDefault(type: string) {
  switch (type) {
    case 'community-guidelines':
      return require('../defaults/default-community-guidelines')
        .DEFAULT_COMMUNITY_GUIDELINES_CONTENT;
  }

  return 'Coming soon...';
}
