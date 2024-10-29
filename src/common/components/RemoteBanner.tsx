import { Linking, StyleSheet } from 'react-native';

import Banner from './Banner';
import moment from 'moment';
import type { ClickRef } from '../services/analytics.service';
import { DismissIdentifier } from '../stores/DismissalStore';

import { useRemoteBannerQuery } from '~/graphql/strapi';
import { MarkDown } from './MarkDown';
import sp from '~/services/serviceProvider';

export default function RemoteBanner() {
  const {
    data: { topbarAlert } = {},
    isLoading,
    isError,
  } = useRemoteBannerQuery();

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
        sp.resolve('analytics').trackClick(
          `banner:${identifier}:action` as ClickRef,
        );
        Linking.openURL(url);
      }
    : undefined;

  return (
    <Banner
      dismissIdentifier={`banner:${identifier}` as DismissIdentifier}
      onPress={onPress}
      text={<MarkDown style={styles}>{message}</MarkDown>}
    />
  );
}

const styles = sp.styles.create({
  body: ['colorPrimaryText', 'fontLM'],
  link: ['link', 'bold'],
}) as StyleSheet.NamedStyles<any>;
