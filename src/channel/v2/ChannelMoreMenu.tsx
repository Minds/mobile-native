import React, { useCallback, forwardRef } from 'react';
import ActionSheet from 'react-native-actionsheet';
import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useNavigation } from '@react-navigation/native';

import type UserModel from '../UserModel';
import i18n from '../../common/services/i18n.service';
import type { AppStackParamList } from '../../navigation/NavigationTypes';

/**
 * Get menu options
 * @param channel
 */
const getOptions = (channel: UserModel) => {
  let options = [i18n.t('cancel')];
  if (channel.isSubscribed()) {
    options.push(i18n.t('channel.unsubscribe'));
  }
  if (!channel.blocked) {
    options.push(i18n.t('channel.block'));
  } else {
    options.push(i18n.t('channel.unblock'));
  }
  options.push(i18n.t('channel.report'));
  return options;
};

type PropsType = {
  channel: UserModel;
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
      let options = getOptions(props.channel);
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
      }
    },
    [props.channel, navigation],
  );

  return (
    <ActionSheet
      ref={ref}
      title={i18n.t('actions')}
      options={getOptions(props.channel)}
      onPress={handleSelection}
      cancelButtonIndex={0}
    />
  );
};

export default forwardRef(ChannelMoreMenu);
