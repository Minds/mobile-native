import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import ActivityIndicator from '../ActivityIndicator';
import ErrorLoading from '../ErrorLoading';
import { FeedListPropsType } from './FeedList';

const Footer = observer((props: FeedListPropsType) => {
  const theme = ThemedStyles.style;
  if (props.feedStore.loading && !props.feedStore.refreshing) {
    return (
      <View
        style={[theme.centered, theme.padding3x]}
        testID="ActivityIndicatorView">
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  if (props.feedStore.errorLoading) {
    const message = props.feedStore.entities.length
      ? i18n.t('cantLoadMore')
      : i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={props.feedStore.reload} />;
  }
  return null;
});

export default Footer;
