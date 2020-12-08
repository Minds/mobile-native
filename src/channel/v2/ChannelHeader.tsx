import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import IconM from 'react-native-vector-icons/MaterialIcons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';
import settingsStore from '../../settings/SettingsStore';
import type { ChannelStoreType, ChannelTabType } from './createChannelStore';
import { Image } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import abbrev from '../../common/helpers/abbrev';
import ChannelDescription from './ChannelDescription';
import ChannelButtons from './ChannelButtons';
import FeedFilter from '../../common/components/FeedFilter';
import ChannelBadges from '../badges/ChannelBadges';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import { FLAG_EDIT_CHANNEL } from '../../common/Permissions';
import * as Progress from 'react-native-progress';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import AboutTab from './tabs/AboutTab';
import TierManagementScreen from '../../common/components/tier-management/TierManagementScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PropsType = {
  store: ChannelStoreType;
  navigation: any;
  route: any;
  hideButtons?: boolean;
  hideDescription?: boolean;
  hideTabs?: boolean;
};

const bannerAspectRatio = 2.9;
const { width } = Dimensions.get('window');
const bannerHeight = width / bannerAspectRatio;
const avatarSize = Math.min(180, Math.round(0.7 * bannerHeight));

/**
 * Channel Header
 */
const ChannelHeader = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  if (!props.store.channel) {
    return null;
  }
  const channel = props.store.channel;
  const [showBanner, setShowBanner] = useState(!settingsStore.dataSaverEnabled);
  const insets = useSafeAreaInsets();
  const cleanTop = insets.top ? { marginTop: insets.top } : null;

  const _onBannerDownload = useCallback(() => setShowBanner(true), []);
  const canEdit = channel.isOwner() && channel.can(FLAG_EDIT_CHANNEL);

  const navToSubscribers = useCallback(() => {
    if (props.store.channel) {
      props.navigation.push('Subscribers', {
        guid: props.store.channel.guid,
      });
    }
  }, [props.navigation, props.store]);

  const navToSubscriptions = useCallback(() => {
    if (props.store.channel) {
      props.navigation.push('Subscribers', {
        guid: props.store.channel.guid,
        filter: 'subscriptions',
      });
    }
  }, [props.navigation, props.store]);

  const tabs: Array<TabType<ChannelTabType>> = channel.isOwner()
    ? [
        { id: 'feed', title: i18n.t('feed') },
        { id: 'memberships', title: i18n.t('settings.otherOptions.b1') },
        // { id: 'shop', title: 'Shop' },
        { id: 'about', title: i18n.t('about') },
      ]
    : [
        { id: 'feed', title: i18n.t('feed') },
        // { id: 'shop', title: 'Shop' },
        { id: 'about', title: i18n.t('about') },
      ];

  const screen = () => {
    switch (props.store.tab) {
      case 'feed':
        return (
          <View
            style={[
              styles.bottomBar,
              theme.borderPrimary,
              theme.paddingHorizontal4x,
              theme.rowJustifySpaceBetween,
            ]}>
            {props.store.feedStore.scheduledCount > 0 ? (
              <View
                style={[
                  theme.borderBottom,
                  props.store.showScheduled
                    ? theme.borderTab
                    : theme.borderTransparent,
                ]}>
                <Text
                  style={[theme.fontL, theme.colorSecondaryText]}
                  onPress={props.store.toggleScheduled}>
                  {i18n.t('channel.viewScheduled')}:{' '}
                  <Text style={theme.colorPrimaryText}>
                    {props.store.feedStore.scheduledCount}
                  </Text>
                </Text>
              </View>
            ) : (
              <View />
            )}
            <FeedFilter store={props.store} />
          </View>
        );
      case 'about':
        return (
          <ScrollView>
            <AboutTab store={props.store} navigation={props.navigation} />
          </ScrollView>
        );
      case 'memberships':
        return (
          <TierManagementScreen
            route={props.route}
            navigation={props.navigation}
          />
        );
      default:
        return <View />;
    }
  };

  const Background: any = showBanner ? ImageBackground : View;

  return (
    <View style={[styles.container, cleanTop]}>
      <Background
        style={styles.banner}
        source={channel.getBannerSource()}
        resizeMode="cover">
        <View style={[styles.avatarContainer, theme.borderBackgroundTertiary]}>
          <Image
            style={[styles.avatar, theme.borderPrimary]}
            source={channel.getAvatarSource()}
            resizeMode="cover"
          />
          {canEdit && (
            <SmallCircleButton
              name="camera"
              style={styles.avatarSmallButton}
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
        {!props.hideButtons && (
          <ChannelButtons
            store={props.store}
            onEditPress={() =>
              props.navigation.push('EditChannelScreen', { store: props.store })
            }
            notShow={['message', 'wire', 'more']}
            iconsStyle={theme.colorSecondaryText}
            containerStyle={styles.buttonsMarginContainer}>
            {!showBanner && settingsStore.dataSaverEnabled && (
              <Icon
                raised
                reverse
                name="file-download"
                type="material"
                color={ThemedStyles.getColor('secondary_background')}
                reverseColor={ThemedStyles.getColor('primary_text')}
                size={15}
                onPress={_onBannerDownload}
              />
            )}
          </ChannelButtons>
        )}
        {props.store.uploading && props.store.bannerProgress ? (
          <View style={styles.tapOverlayView}>
            <Progress.Pie progress={props.store.bannerProgress} size={36} />
          </View>
        ) : null}
      </Background>
      {canEdit && (
        <SmallCircleButton
          name="camera"
          style={styles.bannerSmallButton}
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
          iconStyle={theme.colorLink}
        />
      </View>
      <Text
        style={[
          styles.username,
          theme.colorSecondaryText,
          theme.paddingTop,
          theme.paddingBottom3x,
        ]}
        numberOfLines={1}>
        @{channel.username}
      </Text>
      <View style={theme.paddingHorizontal4x}>
        <Text style={[theme.colorSecondaryText, theme.fontL]}>
          <Text onPress={navToSubscribers} style={theme.colorSecondaryText}>
            {i18n.t('subscribers')}
            <Text> {abbrev(channel.subscribers_count, 0)}</Text>
          </Text>
          <Text onPress={navToSubscriptions} style={theme.colorSecondaryText}>
            {' · ' + i18n.t('subscriptions')}
            <Text> {abbrev(channel.subscriptions_count, 0)}</Text>
          </Text>
          {' · '} <McIcon name="eye" size={17} />
          <Text> {abbrev(channel.impressions, 1)}</Text>
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
        {!props.hideDescription && (
          <View style={theme.paddingTop2x}>
            <ChannelDescription channel={channel} />
          </View>
        )}
      </View>
      {!props.hideTabs && (
        <>
          <TopbarTabbar
            tabs={tabs}
            onChange={props.store.setTab}
            current={props.store.tab}
          />
          {screen()}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  buttonsMarginContainer: {
    marginTop: 5,
  },
  bannerSmallButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  avatarSmallButton: {
    position: 'absolute',
    top: -10,
    right: -10,
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
    elevation: 10,
    width: avatarSize + 6,
    height: avatarSize + 6,
    borderRadius: (avatarSize + 6) / 2,
    zIndex: 10000,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
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
