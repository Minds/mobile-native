import React, { forwardRef } from 'react';
import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useNavigation } from '@react-navigation/native';

import type UserModel from '../UserModel';
import i18n from '../../common/services/i18n.service';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import shareService from '../../share/ShareService';
import { MINDS_URI } from '../../config/Config';
import { observer } from 'mobx-react';
import {
  BottomSheet,
  BottomSheetButton,
  MenuItem,
} from '../../common/components/bottom-sheet';
import { Platform } from 'react-native';

function dismiss(ref) {
  setTimeout(() => {
    ref.current?.dismiss();
  }, 0);
}

/**
 * Get menu options
 * @param channel
 */
const getOptions = (
  channel: UserModel,
  isSubscribedToTier: boolean,
  onSearchChannelPressed: () => void,
  navigation,
  ref: any,
) => {
  let options: Array<{
    iconName: string;
    iconType: string;
    title: string;
    onPress: () => void;
  }> = [];
  options.push({
    iconName: 'share-social',
    iconType: 'ionicon',
    title: i18n.t('channel.share'),
    onPress: () => {
      shareService.share(i18n.t('channel.share'), MINDS_URI + channel.username);
      ref.current.dismiss();
    },
  });

  options.push({
    iconName: 'search-outline',
    iconType: 'ionicon',
    title: 'Search Channel',
    onPress: () => {
      onSearchChannelPressed()
      ref.current.dismiss();
    },
  });

  if (channel.isOwner()) {
    options.push({
      iconName: 'trending-up',
      iconType: 'material-community',
      title: i18n.t('boosts.boostChannel'),
      onPress: () => {
        navigation.navigate('BoostChannelScreen', {});
        ref.current.dismiss();
      },
    });
  }
  if (channel.isSubscribed()) {
    options.push({
      iconName: 'person-remove-outline',
      iconType: 'ionicon',
      title: i18n.t('channel.unsubscribe'),
      onPress: () => {
        channel.toggleSubscription();
        dismiss(ref);
      },
    });
  } else {
    options.push({
      iconName: 'person-add-outline',
      iconType: 'ionicon',
      title: i18n.t('channel.subscribe'),
      onPress: () => {
        channel.toggleSubscription();
        dismiss(ref);
      },
    });
  }
  if (!channel.blocked) {
    options.push({
      iconName: 'remove-circle-outline',
      iconType: 'ionicon',
      title: i18n.t('channel.block'),
      onPress: () => {
        channel.toggleBlock();
        ref.current.dismiss();
      },
    });
  } else {
    options.push({
      iconName: 'remove-circle-outline',
      iconType: 'ionicon',
      title: i18n.t('channel.unblock'),
      onPress: () => {
        channel.toggleBlock();
        ref.current.dismiss();
      },
    });
  }
  options.push({
    title: i18n.t('channel.report'),
    iconName: 'ios-flag-outline',
    iconType: 'ionicon',
    onPress: () => {
      navigation.push('Report', {
        entity: channel,
      });
      ref.current.dismiss();
    },
  });
  isSubscribedToTier &&
    Platform.OS !== 'ios' &&
    options.push({
      iconName: 'attach-money',
      iconType: 'material',
      title: i18n.t('settings.billingOptions.2'),
      onPress: () => {
        navigation.navigate('RecurringPayments', {});
        ref.current.dismiss();
      },
    });
  return options;
};

type PropsType = {
  channel: UserModel;
  isSubscribedToTier: boolean;
  onSearchChannelPressed: () => void;
};

type NavigationType = NativeStackNavigationProp<AppStackParamList, 'Channel'>;

/**
 * Channel More Menu (action sheet)
 * @param props
 */
const ChannelMoreMenu = forwardRef((props: PropsType, ref: any) => {
  const navigation = useNavigation<NavigationType>();

  const options = getOptions(
    props.channel,
    props.isSubscribedToTier,
    props.onSearchChannelPressed,
    navigation,
    ref,
  );

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  return (
    <BottomSheet ref={ref}>
      {options.map((b, i) => (
        <MenuItem {...b} key={i} />
      ))}
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheet>
  );
});

export default observer(ChannelMoreMenu);
