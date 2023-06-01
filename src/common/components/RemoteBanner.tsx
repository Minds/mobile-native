import { Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import Markdown from 'react-native-markdown-display';

import { gqlClient } from '~/services';
import Banner from './Banner';
import analyticsService, { ClickRef } from '../services/analytics.service';
import moment from 'moment';
import { DismissIdentifier } from '../stores/DismissalStore';
import ThemedStyles from '~/styles/ThemedStyles';

export default function RemoteBanner() {
  const { data, isLoading, isError } = useQueryBanner();

  if (isLoading || isError || !data?.enabled) {
    return null;
  }

  const { message, identifier, url, onlyDisplayAfter } = data || {};

  if (moment(onlyDisplayAfter).isAfter(moment())) {
    return null;
  }

  const onPress = url
    ? () => {
        analyticsService.trackClick(`banner:${identifier}:action` as ClickRef);
        Linking.openURL(url);
      }
    : undefined;

  return (
    <Banner
      dismissIdentifier={`banner:${identifier}` as DismissIdentifier}
      onPress={onPress}
      text={<Markdown style={styles}>{fixDeepLinks(message)}</Markdown>}
    />
  );
}

// replace relative links with absolute app links `mindsapp://`
const fixDeepLinks = (url: string) => url.replace(/\]\(\//g, '](mindsapp://');

const styles = ThemedStyles.create({
  body: ['colorPrimaryText', 'fontLM'],
  link: ['link', 'bold'],
});

const GET_TOPBAR_QUERY = gql`
  {
    topbarAlert {
      data {
        id
        attributes {
          message
          enabled
          url
          identifier
          onlyDisplayAfter
        }
      }
    }
  }
`;

type AlertProps = {
  message: string;
  enabled: boolean;
  url: string;
  identifier: string;
  onlyDisplayAfter: string;
};

const useQueryBanner = () => {
  return useQuery<any, unknown, AlertProps>({
    queryKey: ['topbarAlert'],
    queryFn: () => gqlClient().request(GET_TOPBAR_QUERY),
    select: result => result.topbarAlert?.data?.attributes,
  });
};
