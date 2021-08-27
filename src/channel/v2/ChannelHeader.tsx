import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import type { ChannelStoreType, ChannelTabType } from './createChannelStore';
import { Image } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import abbrev from '../../common/helpers/abbrev';
import ChannelDescription from './ChannelDescription';
import ChannelButtons from './ChannelButtons';
import FeedFilter from '../../common/components/FeedFilter';
import ChannelBadges from '../badges/ChannelBadges';
import TopbarTabbar, {
  TabType,
} from '../../common/components/topbar-tabbar/TopbarTabbar';
import AboutTab from './tabs/AboutTab';
import TierManagementScreen from '../../common/components/tier-management/TierManagementScreen';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import FadeView from '../../common/components/FadeView';
import JoinMembershipScreen from '../../wire/v2/tiers/JoinMembership';
import FastImage from 'react-native-fast-image';

const CENTERED = false;

type PropsType = {
  store?: ChannelStoreType;
  navigation: any;
  route: any;
  hideButtons?: boolean;
  hideDescription?: boolean;
  hideTabs?: boolean;
  hideImages?: boolean;
  channelName?: string;
  onOpenSubscribers?: () => void;
  onOpenSubscriptions?: () => void;
};

const bannerAspectRatio = 2.9;
const { width } = Dimensions.get('window');
const bannerHeight = width / bannerAspectRatio;
const avatarSize = Math.min(170, Math.round(0.6 * bannerHeight));

/**
 * Channel Header
 */
const ChannelHeader = withErrorBoundary(
  observer((props: PropsType) => {
    // =====================| STATES & VARIABLES |=====================>
    const theme = ThemedStyles.style;
    const [fadeViewWidth, setFadeViewWidth] = useState(50);
    const FADE_LENGTH = 30;
    const channel = props.store?.channel;
    const tabs: Array<TabType<ChannelTabType>> = channel?.isOwner()
      ? [
          { id: 'feed', title: i18n.t('feed') },
          { id: 'memberships', title: i18n.t('settings.otherOptions.b1') },
          // { id: 'shop', title: 'Shop' },
          { id: 'about', title: i18n.t('about') },
        ]
      : [
          { id: 'feed', title: i18n.t('feed') },
          props.store?.tiers?.length
            ? { id: 'memberships', title: i18n.t('settings.otherOptions.b1') }
            : (null as any),
          // { id: 'shop', title: 'Shop' },
          { id: 'about', title: i18n.t('about') },
        ].filter(Boolean);

    // =====================| METHODS |=====================>
    const onFadeViewLayout = useCallback(event => {
      setFadeViewWidth(event.nativeEvent.layout.width);
    }, []);

    // =====================| RENDERS |=====================>
    if (props.store && !props.store.channel) {
      return null;
    }

    const screen = () => {
      switch (props.store?.tab) {
        case 'feed':
          if (
            props.store.feedStore.entities.length &&
            props.store.feedStore.scheduledCount > 0
          ) {
            return (
              <View
                style={[
                  styles.bottomBar,
                  theme.bcolorPrimaryBorder,
                  theme.paddingHorizontal4x,
                  theme.rowJustifySpaceBetween,
                ]}>
                {props.store.feedStore.scheduledCount > 0 ? (
                  <View
                    style={[
                      theme.borderBottom,
                      props.store.showScheduled
                        ? theme.bcolorTabBorder
                        : theme.bcolorTransparent,
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
              </View>
            );
          } else {
            return null;
          }
        case 'about':
          return (
            <ScrollView>
              <AboutTab store={props.store} navigation={props.navigation} />
            </ScrollView>
          );
        case 'memberships':
          if (props.store?.channel?.isOwner()) {
            return (
              <TierManagementScreen
                route={props.route}
                navigation={props.navigation}
              />
            );
          } else {
            return (
              <JoinMembershipScreen
                route={{
                  ...props.route,
                  params: {
                    user: props.store.channel,
                    tiers: props.store.tiers,
                  },
                }}
                navigation={props.navigation}
              />
            );
          }
        default:
          return <View />;
      }
    };

    return (
      <>
        <View
          style={[
            theme.bgPrimaryBackground,
            {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: 155,
              paddingBottom: props.store?.tab === 'feed' ? undefined : 200,
            },
          ]}>
          <View style={theme.paddingHorizontal4x}>
            {/**
             * Avatar
             **/}
            {props.store && channel && !props.hideImages && (
              <View
                style={[styles.avatarContainer, theme.bcolorPrimaryBackground]}>
                <FastImage
                  style={styles.avatar}
                  source={channel.getAvatarSource()}
                  resizeMode="cover"
                />
              </View>
            )}

            {/**
             * When there wasn't a channel, show a bulb as profile picture
             **/}
            {!channel && (
              <View
                style={[styles.avatarContainer, theme.bcolorPrimaryBackground]}>
                <Image
                  style={styles.avatar}
                  source={require('./../../assets/logos/bulb.png')}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={CENTERED ? theme.centered : undefined}>
              <View
                style={[
                  theme.rowJustifyStart,
                  theme.alignCenter,
                  theme.paddingTop10x,
                ]}>
                <Text style={styles.name} numberOfLines={1}>
                  {channel ? channel.name : props.channelName}
                </Text>
                {channel && (
                  <ChannelBadges
                    channel={channel}
                    size={20}
                    iconStyle={theme.colorLink}
                  />
                )}
              </View>
              <View style={[theme.rowStretch, theme.paddingBottom1x]}>
                <Text
                  style={[styles.username, theme.colorSecondaryText]}
                  numberOfLines={1}>
                  @{channel ? channel.username : props.channelName}
                </Text>
                {channel!.subscriber && (
                  <Text style={theme.colorSecondaryText}>
                    {` · `}
                    {i18n.t('channel.subscriber')}
                  </Text>
                )}
              </View>
            </View>

            {!props.hideButtons && (
              <ChannelButtons
                store={props.store}
                onEditPress={() =>
                  props.navigation.push('EditChannelScreen', {
                    store: props.store,
                  })
                }
                notShow={['message', 'wire', 'more']}
                iconsStyle={theme.colorSecondaryText}
                containerStyle={styles.buttonsMarginContainer}
              />
            )}

            {channel && (
              <>
                {!props.hideDescription && (
                  <View style={[theme.paddingTop2x, theme.paddingBottom]}>
                    <ChannelDescription channel={channel} />
                  </View>
                )}
                {!!channel.city && (
                  <View
                    style={[
                      theme.paddingTop,
                      theme.paddingBottom2x,
                      styles.location,
                    ]}>
                    <IconM
                      name="location-on"
                      style={theme.colorPrimaryText}
                      size={15}
                    />
                    <Text style={[theme.fontM, theme.paddingLeft]}>
                      {channel.city}
                    </Text>
                  </View>
                )}
                <Text
                  style={[
                    theme.colorSecondaryText,
                    theme.fontM,
                    theme.paddingTop,
                  ]}>
                  <Text
                    onPress={props.onOpenSubscribers}
                    style={theme.colorSecondaryText}>
                    <Text> {abbrev(channel.subscribers_count, 0)}</Text>
                    {' ' + i18n.t('subscribers') + '    '}
                  </Text>
                  <Text
                    onPress={props.onOpenSubscriptions}
                    style={theme.colorSecondaryText}>
                    <Text> {abbrev(channel.subscriptions_count, 0)}</Text>
                    {' ' + i18n.t('subscriptions')}
                  </Text>
                </Text>
              </>
            )}
          </View>
          {props.store && !props.hideTabs && (
            <>
              <View
                style={[
                  {
                    justifyContent: 'flex-end',
                    paddingTop: 16,
                    paddingRight:
                      props.store?.tab === 'feed'
                        ? fadeViewWidth - FADE_LENGTH
                        : undefined,
                  },
                  theme.bcolorPrimaryBorder,
                  theme.borderBottom8x,
                  theme.bcolorTertiaryBackground,
                ]}>
                <TopbarTabbar
                  tabs={tabs}
                  onChange={props.store.setTab}
                  current={props.store.tab}
                  containerStyle={{ borderBottomWidth: 0 }}
                />
                {props.store?.tab === 'feed' && (
                  <FadeView
                    fades={['left']}
                    fadeLength={FADE_LENGTH}
                    onLayout={onFadeViewLayout}
                    style={{
                      position: 'absolute',
                      right: 0,
                      paddingLeft: FADE_LENGTH / 1.5,
                      bottom: 1,
                    }}>
                    <FeedFilter
                      store={props.store}
                      containerStyles={styles.feedFilter}
                    />
                  </FadeView>
                )}
              </View>

              {screen()}
            </>
          )}
        </View>
      </>
    );
  }),
);

const styles = ThemedStyles.create({
  buttonsMarginContainer: {
    marginTop: 5,
    position: 'absolute',
    right: 0,
    top: 5,
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
    // paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    marginBottom: 10,
  },
  username: {
    // fontSize: 16,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 5,
  },
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
  },
  avatarContainer: [
    'bgSecondaryBackground',
    {
      position: 'absolute',
      top: -avatarSize / 1.8,
      left: CENTERED ? undefined : 20,
      alignSelf: 'center',
      borderWidth: 5,
      borderRadius: (avatarSize + 6) / 2,
    },
  ],
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
  feedFilter: [
    'paddingVertical3x',
    'paddingRight3x',
    'paddingLeft2x',
    'borderRadius4x',
    'bgPrimaryBackground',
  ],
});

export default ChannelHeader;
