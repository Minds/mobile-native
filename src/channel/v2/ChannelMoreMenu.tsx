import React, { useCallback, forwardRef } from 'react';
import ActionSheet from 'react-native-actionsheet';
import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useNavigation } from '@react-navigation/native';

import type UserModel from '../UserModel';
import i18n from '../../common/services/i18n.service';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import shareService from '../../share/ShareService';
import { MINDS_URI } from '../../config/Config';

/**
 * Get menu options
 * @param channel
 */
const getOptions = (channel: UserModel, isSubscribedToTier: boolean) => {
  let options = [i18n.t('cancel')];
  options.push(i18n.t('channel.share'));
  if (channel.isOwner()) {
    options.push(i18n.t('boosts.boostChannel'));
  }
  if (channel.isSubscribed()) {
    options.push(i18n.t('channel.unsubscribe'));
  }
  if (!channel.blocked) {
    options.push(i18n.t('channel.block'));
  } else {
    options.push(i18n.t('channel.unblock'));
  }
  options.push(i18n.t('channel.report'));
  isSubscribedToTier && options.push(i18n.t('settings.billingOptions.2'));
  return options;
};

type PropsType = {
  channel: UserModel;
  isSubscribedToTier: boolean;
};

/**
 * Channel More Menu (action sheet)
 * @param props
 */
const ChannelMoreMenu = (props: PropsType, ref: any) => {
  const navigation = useNavigation<
    NativeStackNavigationProp<AppStackParamList, 'Channel'>
  >();

  const handleSelection = useCallback(
    (option) => {
      let options = getOptions(props.channel, props.isSubscribedToTier);
      let selected = options[option];
      switch (selected) {
        case i18n.t('channel.unsubscribe'):
          props.channel.toggleSubscription();
          break;
        case i18n.t('channel.block'):
          props.channel.toggleBlock();
          break;
        case i18n.t('channel.unblock'):
          props.channel.toggleBlock();
          break;
        case i18n.t('channel.report'):
          navigation.push('Report', {
            entity: props.channel,
          });
          break;
        case i18n.t('settings.billingOptions.2'):
          navigation.navigate('RecurringPayments', {});
          break;
        case i18n.t('channel.share'):
          shareService.share(
            i18n.t('channel.share'),
            MINDS_URI + props.channel.username,
          );
          break;
        case i18n.t('boosts.boostChannel'):
          navigation.navigate('BoostChannelScreen', {});
          break;
      }
    },
    [props, navigation],
  );

  return (
    <ActionSheet
      ref={ref}
      title={i18n.t('actions')}
      options={getOptions(props.channel, props.isSubscribedToTier)}
      onPress={handleSelection}
      cancelButtonIndex={0}
    />
  );
};

export default forwardRef(ChannelMoreMenu);
