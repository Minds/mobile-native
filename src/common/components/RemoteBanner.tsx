import { Linking } from 'react-native';
import Markdown from 'react-native-markdown-display';

import Banner from './Banner';
import analyticsService, { ClickRef } from '../services/analytics.service';
import moment from 'moment';
import { DismissIdentifier } from '../stores/DismissalStore';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTopbarAlertQuery } from '~/graphql/strapi';

export default function RemoteBanner() {
  const {
    data: { topbarAlert } = {},
    isLoading,
    isError,
  } = useTopbarAlertQuery();

  const data = topbarAlert?.data?.attributes;

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
