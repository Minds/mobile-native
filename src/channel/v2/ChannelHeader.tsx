import React, { useCallback, useState } from 'react';
import { Dimensions, Image as RNImage, ScrollView, View } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import { Image } from 'expo-image';

import type { ChannelStoreType, ChannelTabType } from './createChannelStore';
import ThemedStyles, { useMemoStyle } from '../../styles/ThemedStyles';
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
import MText from '../../common/components/MText';
import { B2, Column, H4, Row } from '~ui';
import { IS_IOS } from '~/config/Config';
import ChannelRecommendation from '~/common/components/ChannelRecommendation/ChannelRecommendation';
import UserModel from '../UserModel';
import useModelEvent from '~/common/hooks/useModelEvent';
import MutualSubscribers from '../components/MutualSubscribers';
import GroupsTab from './tabs/GroupsTab';

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
  onOpenSubscribersYouKnow?: () => void;
};

const bannerAspectRatio = 2.9;
const { width } = Dimensions.get('window');
const bannerHeight = width / bannerAspectRatio;
const avatarSize = Math.min(170, Math.round(0.6 * bannerHeight));
const FADE_LENGTH = 30;

/**
 * Channel Header
 */
const ChannelHeader = withErrorBoundary(
  observer((props: PropsType) => {
    // =====================| STATES & VARIABLES |=====================>
    const theme = ThemedStyles.style;
    const [fadeViewWidth, setFadeViewWidth] = useState(50);
    /** Whether the user interacted with the channel */
    const [interacted, setInteracted] = useState(false);
    const channel = props.store?.channel;
    const channelGuid = channel?.guid;
    const ownChannel = channel?.isOwner();
    /** Whether the channel recommendation widget should be shown after channel is subscribed */
    const shouldRenderChannelRecommendation =
      !ownChannel && Boolean(props.store?.feedStore.entities.length);
    const tabs: Array<TabType<ChannelTabType>> = [
      { id: 'feed', title: i18n.t('feed') },
      { id: 'memberships', title: i18n.t('settings.otherOptions.b1') },
      { id: 'groups', title: i18n.t('groups.title') },
      { id: 'about', title: i18n.t('about') },
    ];
    // remove membership tab
    if (IS_IOS || !props.store?.tiers?.length) {
      tabs.splice(1, 1);
    }
    const bottomBarInnerWrapper = useMemoStyle(
      [
        'borderBottom',
        props.store?.showScheduled
          ? theme.bcolorTabBorder
          : theme.bcolorTransparent,
      ],
      [props.store?.showScheduled],
    );
    const topbarWrapper = useMemoStyle(
      [
        {
          justifyContent: 'flex-end',
          paddingTop: 16,
          paddingRight:
            props.store?.tab === 'feed'
              ? fadeViewWidth - FADE_LENGTH
              : undefined,
        },
        'bcolorPrimaryBorder',
        'borderBottom6x',
        'bcolorTertiaryBackground',
      ],
      [props.store?.tab],
    );

    // =====================| EFFECTS |=====================>
    useModelEvent(
      UserModel,
      'toggleSubscription',
      ({ user, shouldUpdateFeed }) => {
        if (user.guid === channelGuid && shouldUpdateFeed) {
          setInteracted(user.subscribed);
        }
      },
      [channelGuid],
    );

    // =====================| METHODS |=====================>
    const onFadeViewLayout = useCallback(event => {
      setFadeViewWidth(event.nativeEvent.layout.width);
    }, []);

    const onEditPress = useCallback(
      () =>
        props.navigation.push('ChannelEdit', {
          store: props.store,
        }),
      [props.store, props.navigation],
    );

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
              <View style={styles.bottomBar}>
                {props.store.feedStore.scheduledCount > 0 ? (
                  <View style={bottomBarInnerWrapper}>
                    <MText
                      style={styles.viewScheduled}
                      onPress={props.store.toggleScheduled}>
                      {i18n.t('channel.viewScheduled')}:{' '}
                      <MText style={theme.colorPrimaryText}>
                        {props.store.feedStore.scheduledCount}
                      </MText>
                    </MText>
                  </View>
                ) : (
                  <View />
                )}
              </View>
            );
          } else {
            return null;
          }
        case 'groups':
          return (
            <GroupsTab store={props.store} navigation={props.navigation} />
          );
        case 'about':
          return (
            <ScrollView>
              <AboutTab store={props.store} navigation={props.navigation} />
            </ScrollView>
          );
        case 'memberships':
          if (ownChannel) {
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
      }
    };

    return (
      <View style={styles.container}>
        <View style={theme.paddingHorizontal4x}>
          {/**
           * Avatar
           **/}
          {props.store && channel && !props.hideImages && (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={channel.getAvatarSource()}
                contentFit="cover"
              />
            </View>
          )}

          {/**
           * When there wasn't a channel, show a bulb as profile picture
           **/}
          {!channel && (
            <View style={styles.avatarContainer}>
              <RNImage
                style={styles.avatar}
                source={require('./../../assets/logos/bulb.png')}
                resizeMode="cover"
              />
            </View>
          )}

          <Column top="XXXL2" align={CENTERED ? 'centerBoth' : undefined}>
            <Row align="centerStart">
              <H4 numberOfLines={1}>
                {channel ? channel.name : props.channelName}
              </H4>
              {channel && <ChannelBadges channel={channel} left="XS" />}
            </Row>
            <Row top="XXXS">
              <B2 color="secondary" numberOfLines={1}>
                @{channel ? channel.username : props.channelName}
              </B2>
              {Boolean(channel!.subscriber) && (
                <B2 color="secondary">
                  {' · '}
                  {i18n.t('channel.subscriber')}
                </B2>
              )}
            </Row>
          </Column>

          {!props.hideButtons && (
            <ChannelButtons
              store={props.store}
              onEditPress={onEditPress}
              notShow={['message', 'wire', 'more']}
              iconsStyle={theme.colorSecondaryText}
              containerStyle={styles.buttonsMarginContainer}
            />
          )}

          {channel && (
            <>
              {!props.hideDescription && (
                <View style={styles.channelDescription}>
                  <ChannelDescription channel={channel} />
                </View>
              )}
              {!!channel.city && (
                <View style={styles.location}>
                  <IconM
                    name="location-on"
                    style={theme.colorPrimaryText}
                    size={15}
                  />
                  <MText style={styles.city}>{channel.city}</MText>
                </View>
              )}
              <MText style={styles.subscribersWrapper}>
                <MText
                  onPress={props.onOpenSubscribers}
                  style={theme.colorSecondaryText}>
                  <MText> {abbrev(channel.subscribers_count, 1)}</MText>
                  {' ' + i18n.t('subscribers') + '    '}
                </MText>
                <MText
                  onPress={props.onOpenSubscriptions}
                  style={theme.colorSecondaryText}>
                  <MText> {abbrev(channel.subscriptions_count, 1)}</MText>
                  {' ' + i18n.t('subscriptions')}
                </MText>
              </MText>

              {!ownChannel && (
                <MutualSubscribers
                  navigation={props.navigation}
                  channel={channel}
                  top="M"
                  onPress={props.onOpenSubscribersYouKnow}
                />
              )}
            </>
          )}
        </View>
        {props.store && !props.hideTabs && (
          <>
            <View style={topbarWrapper}>
              <TopbarTabbar
                tabs={tabs}
                onChange={props.store.setTab}
                current={props.store.tab}
                containerStyle={styles.topbarContainerStyle}
              />
              {props.store?.tab === 'feed' && (
                <FadeView
                  fades={['left']}
                  fadeLength={FADE_LENGTH}
                  onLayout={onFadeViewLayout}
                  style={styles.fadeView}>
                  <FeedFilter
                    dateRange
                    store={props.store}
                    containerStyles={styles.feedFilter}
                    textStyle={styles.feedFilterText}
                  />
                </FadeView>
              )}
            </View>

            {screen()}
          </>
        )}

        {shouldRenderChannelRecommendation && (
          <ChannelRecommendation
            channel={channel}
            visible={interacted}
            location="channel"
          />
        )}
      </View>
    );
  }),
);

const styles = ThemedStyles.create({
  channelDescription: ['paddingVertical'],
  buttonsMarginContainer: {
    position: 'absolute',
    right: 7,
    top: 12,
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
  bottomBar: [
    'bcolorPrimaryBorder',
    'paddingHorizontal4x',
    'rowJustifySpaceBetween',
    {
      borderBottomWidth: 1,
      height: 50,
      alignItems: 'center',
      width: '100%',
    },
  ],
  location: [
    'paddingTop',
    'paddingBottom2x',
    {
      // paddingTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
  ],
  container: [
    'bgPrimaryBackground',
    {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 155,
    },
  ],
  username: [
    'colorSecondaryText',
    {
      // fontSize: 16,
      textAlign: 'center',
    },
  ],
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 5,
  },
  nameWrapper: ['rowJustifyStart', 'alignCenter', 'paddingTop10x'],
  avatarContainer: [
    'bgSecondaryBackground',
    'bcolorPrimaryBackground',
    {
      position: 'absolute',
      top: -avatarSize / 1.8,
      left: CENTERED ? undefined : 20,
      alignSelf: 'center',
      borderWidth: 3,
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
    {
      paddingVertical: 13,
    },
    'paddingRight3x',
    'paddingLeft2x',
    'borderRadius4x',
    'bgPrimaryBackground',
  ],
  feedFilterText: ['colorSecondaryText'],
  viewScheduled: ['fontL', 'colorSecondaryText'],
  subscribersWrapper: ['colorSecondaryText', 'fontM', 'paddingTop'],
  city: ['fontM', 'paddingLeft'],
  topbarContainerStyle: { borderBottomWidth: 0 },
  fadeView: {
    position: 'absolute',
    right: 0,
    paddingLeft: FADE_LENGTH / 1.5,
    bottom: 1,
  },
});

export default ChannelHeader;
