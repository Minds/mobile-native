import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';

import type { ChannelStoreType } from './createChannelStore';
import { Image } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import abbrev from '../../common/helpers/abbrev';
import ChannelDescription from './ChannelDescription';
import ChannelButtons from './ChannelButtons';
import ChannelHeaderTabs from './ChannelHeaderTabs';
import FeedFilter from '../../common/components/FeedFilter';
import { useSafeArea } from 'react-native-safe-area-context';
import ChannelBadges from '../badges/ChannelBadges';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import { FLAG_EDIT_CHANNEL } from '../../common/Permissions';
import * as Progress from 'react-native-progress';

type PropsType = {
  store: ChannelStoreType;
  navigation: any;
};

const bannerAspectRatio = 3.2;
const { width } = Dimensions.get('window');
const bannerHeight = width / bannerAspectRatio;
const avatarSize = Math.round(0.7 * bannerHeight);

/**
 * Channel Header
 */
const ChannelHeader = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  if (!props.store.channel) {
    return null;
  }
  const channel = props.store.channel;
  const insets = useSafeArea();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;

  const canEdit = channel.isOwner() && channel.can(FLAG_EDIT_CHANNEL);

  return (
    <View style={[styles.container, cleanTop]}>
      <View>
        <MIcon
          size={28}
          name="chevron-left"
          style={[styles.backIcon, theme.colorIcon]}
          onPress={props.navigation.goBack}
        />
      </View>
      <ImageBackground
        style={styles.banner}
        source={channel.getBannerSource()}
        resizeMode="cover">
        <View style={[styles.avatarContainer, theme.borderBackgroundPrimary]}>
          <Image
            style={[styles.avatar, theme.borderPrimary]}
            source={channel.getAvatarSource()}
            resizeMode="cover"
          />
          {canEdit && (
            <SmallCircleButton
              name="camera"
              style={[styles.avatarSmallButton]}
              onPress={() => props.store.upload('avatar')}
            />
          )}
          {props.store.uploading && props.store.avatarProgress ? (
            <View
              style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
              <Progress.Pie progress={props.store.avatarProgress} size={36} />
            </View>
          ) : null}
        </View>
        <ChannelButtons
          channel={channel}
          onEditPress={() =>
            props.navigation.push('EditChannelScreen', { store: props.store })
          }
        />
        {props.store.uploading && props.store.bannerProgress ? (
          <View style={styles.tapOverlayView}>
            <Progress.Pie progress={props.store.bannerProgress} size={36} />
          </View>
        ) : null}
      </ImageBackground>
      {canEdit && (
        <SmallCircleButton
          name="camera"
          style={[styles.bannerSmallButton]}
          onPress={() => props.store.upload('banner')}
        />
      )}
      <View
        style={[theme.rowJustifyCenter, theme.alignCenter, theme.paddingTop8x]}>
        <Text style={styles.name} numberOfLines={1}>
          {channel.name}
        </Text>
        <ChannelBadges
          channel={channel}
          size={22}
          iconStyle={theme.colorGreen}
        />
      </View>
      <Text
        style={[
          styles.username,
          theme.colorSecondaryText,
          theme.paddingTop2x,
          theme.paddingBottom3x,
        ]}
        numberOfLines={1}>
        @{channel.username}
      </Text>
      <View style={theme.paddingHorizontal4x}>
        <Text>
          <Text style={[theme.colorSecondaryText, theme.fontL]}>
            {i18n.t('subscribers')}
            <Text> {abbrev(channel.subscribers_count, 0)}</Text>
            {' · ' + i18n.t('subscriptions')}
            <Text> {abbrev(channel.subscriptions_count, 0)}</Text>
            {' · ' + i18n.t('views')}
            <Text> {abbrev(channel.impressions, 1)}</Text>
          </Text>
        </Text>
        {!!channel.city && (
          <View style={styles.location}>
            <IconM
              name="location-on"
              style={theme.colorPrimaryText}
              size={16}
            />
            <Text style={[theme.fontL, theme.paddingLeft]}>{channel.city}</Text>
          </View>
        )}
        <View style={theme.paddingTop2x}>
          <ChannelDescription channel={channel} />
        </View>
      </View>
      <ChannelHeaderTabs store={props.store} />
      <View
        style={[
          styles.bottomBar,
          theme.borderPrimary,
          theme.paddingHorizontal4x,
          theme.rowJustifySpaceBetween,
        ]}>
        <Text style={[theme.fontL, theme.colorSecondaryText]}>
          Scheduled: <Text style={theme.colorPrimaryText}>0</Text>
        </Text>
        <FeedFilter store={props.store} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  backIcon: {
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  bannerSmallButton: {
    position: 'absolute',
    top: 33,
    left: 5,
  },
  avatarSmallButton: {
    position: 'absolute',
    top: -5,
    right: 5,
  },
  description: {
    height: 120,
    width: '100%',
  },
  bottomBar: {
    borderBottomWidth: 1,
    height: 50,
    alignItems: 'center',
    width: '100%',
  },
  location: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
  },
  avatarContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: -avatarSize / 4,
    alignSelf: 'center',
    borderWidth: 3,
    elevation: 20,
    width: avatarSize + 6,
    height: avatarSize + 6,
    borderRadius: 53,
    zIndex: 10000,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000',
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: 50,
  },
  tapOverlayView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrappedAvatarOverlayView: {
    borderRadius: 55,
  },
});

export default ChannelHeader;
