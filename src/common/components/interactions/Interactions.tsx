import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Platform, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import BaseModel from '../../BaseModel';
import Activity from '~/newsfeed/activity/Activity';
import UserModel from '~/channel/UserModel';
import ActivityModel from '~/newsfeed/ActivityModel';
import OffsetList from '../OffsetList';
import { BottomSheetButton } from '../bottom-sheet';
import ChannelListItem from '../ChannelListItem';
import ChannelListItemPlaceholder from '../ChannelListItemPlaceholder';
import ActivityPlaceHolder from '~/newsfeed/ActivityPlaceHolder';
import FeedStore from '~/common/stores/FeedStore';
import FeedList from '../FeedList';
import sp from '~/services/serviceProvider';
import { useStyle } from '~/styles/hooks';

type InteractionsProps = {
  entity: BaseModel;
  withoutInsets?: boolean;
  interaction?: Interactions;
  onCancel?: () => void;
};
/**
 * Interactions Action Sheet
 * @param props
 * @param ref
 */
const Interactions = (props: InteractionsProps) => {
  // =====================| STATES & VARIABLES |=====================>
  const insets = useSafeAreaInsets();
  const interaction = props.interaction ?? 'upVotes';
  const bottomInsets = props.withoutInsets ? 0 : insets.bottom;
  // whether the bottomsheet contents should be kept. defaults to true
  const navigation = useNavigation();
  const footerStyle = useStyle(styles.cancelContainer, {
    paddingBottom: bottomInsets + Platform.select({ default: 0, android: 20 }),
    paddingTop: bottomInsets * 1.5,
  });
  const footerGradientColors = useMemo(
    () => [
      sp.styles.getColor('PrimaryBackground') + '00',
      sp.styles.getColor('PrimaryBackground'),
    ],
    [],
  );
  const entity = props.entity;
  const offsetListRef = useRef<any>();
  const store = useLocalStore(() => ({
    feedStore: new FeedStore(),
    interaction,
    offset: '' as any,
    setInteraction(_interaction: Interactions) {
      store.interaction = _interaction;
      if (_interaction === 'channelSubscriptions') {
        this.feedStore
          .setEndpoint(
            `api/v3/subscriptions/graph/${entity.guid}/subscriptions`,
          )
          .setLimit(12)
          .clear()
          .fetch();
      }
    },
    get endpoint() {
      return (
        {
          upVotes: `api/v3/votes/list/${entity.guid}`,
          downVotes: `api/v3/votes/list/${entity.guid}`,
          subscribers: `api/v3/subscriptions/graph/${entity.guid}/subscribers`,
          channelSubscribers: `api/v1/subscribe/subscribers/${entity.guid}`,
          channelSubscriptions: `api/v3/subscriptions/graph/${entity.guid}/subscriptions`,
          subscribersYouKnow:
            'api/v3/subscriptions/relational/also-subscribe-to',
          default: 'api/v3/newsfeed',
        }[store.interaction] || 'api/v3/newsfeed'
      );
    },
    get opts() {
      const opts: any = {
        limit: 24,
      };

      switch (store.interaction) {
        case 'reminds':
          opts.remind_guid = entity.guid;
          opts.hide_reminds = false;
          break;
        case 'quotes':
          opts.quote_guid = entity.guid;
          break;
        case 'channelSubscriptions':
        case 'channelSubscribers':
          break;
        case 'subscribersYouKnow':
          opts.guid = entity.guid;
          break;
        default:
          opts.direction = store.interaction === 'upVotes' ? 'up' : 'down';
          break;
      }

      return opts;
    },
    get offsetField() {
      return {
        subscribers: 'from_timestamp',
        channelSubscribers: undefined,
        channelSubscriptions: undefined,
        subscribersYouKnow: 'offset',
      }[store.interaction];
    },
    setOffset(offset: any) {
      this.offset = offset;
    },
  }));
  const isVote =
    store.interaction === 'upVotes' || store.interaction === 'downVotes';
  const isChannels =
    store.interaction === 'subscribers' ||
    store.interaction === 'channelSubscriptions' ||
    store.interaction === 'channelSubscribers' ||
    store.interaction === 'subscribersYouKnow';
  let dataField = isVote ? 'votes' : 'entities';
  if (
    store.interaction === 'channelSubscribers' ||
    store.interaction === 'subscribersYouKnow'
  ) {
    dataField = 'users';
  }
  const placeholderCount = useMemo(() => {
    const LIMIT = 24;

    switch (store.interaction) {
      case 'upVotes':
        return Math.min(entity['thumbs:up:count'], LIMIT);
      case 'downVotes':
        return Math.min(entity['thumbs:down:count'], LIMIT);
      case 'reminds':
        // @ts-ignore
        return entity.reminds ? Math.min(entity.reminds, LIMIT) : undefined;
      case 'quotes':
        // @ts-ignore
        return entity.quotes ? Math.min(entity.quotes, LIMIT) : undefined;
      default:
        return 24;
    }
  }, [entity, store.interaction]);

  // =====================| METHODS |=====================>
  useEffect(() => {
    store.setInteraction(interaction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interaction]);

  // =====================| RENDERS |=====================>
  const footer = (
    <View style={footerStyle} pointerEvents={'box-none'}>
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={footerGradientColors}
        pointerEvents={'none'}
      />
      <BottomSheetButton text={sp.i18n.t('cancel')} onPress={props.onCancel} />
    </View>
  );

  const renderPlaceholder = useCallback(() => {
    if (isVote || isChannels) {
      return <ChannelListItemPlaceholder />;
    }

    return <ActivityPlaceHolder />;
  }, [isVote, isChannels]);

  const renderItemUser = useMemo(
    () => _renderItemUser(navigation),
    [navigation],
  );
  const renderItemActivity = useMemo(
    () => _renderItemActivity(navigation),
    [navigation],
  );

  return (
    <>
      {store.interaction !== 'channelSubscriptions' ? (
        <OffsetList
          ref={offsetListRef}
          fetchEndpoint={store.endpoint}
          endpointData={dataField}
          params={store.opts}
          placeholderCount={placeholderCount}
          renderPlaceholder={renderPlaceholder}
          map={isVote ? mapUser : isChannels ? mapSubscriber : mapActivity}
          renderItem={
            isVote || isChannels ? renderItemUser : renderItemActivity
          }
          offsetPagination={store.interaction === 'subscribersYouKnow'}
          offsetField={store.offsetField}
          contentContainerStyle={styles.contentContainerStyle}
        />
      ) : (
        <FeedList
          estimatedItemSize={74.9}
          feedStore={store.feedStore}
          navigation={navigation}
          renderActivity={renderItemUser}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
      {props.onCancel ? footer : null}
    </>
  );
};

export type Interactions =
  | 'upVotes'
  | 'downVotes'
  | 'reminds'
  | 'quotes'
  | 'channelSubscribers'
  | 'channelSubscriptions'
  | 'subscribers'
  | 'subscribersYouKnow';

const _renderItemUser = navigation => (row: { item: any; index: number }) =>
  <ChannelListItem channel={row.item} navigation={navigation} />;
const _renderItemActivity = navigation => (row: { item: any; index: number }) =>
  (
    <Activity
      entity={row.item}
      hideTabs={true}
      hideRemind={true}
      navigation={navigation}
    />
  );

const mapUser = data => data.map(d => UserModel.create(d.actor));
const mapSubscriber = data => data.map(d => UserModel.create(d));
const mapActivity = data =>
  data.map(d => {
    return ActivityModel.create(d);
  });

const styles = sp.styles.create({
  container: ['bgPrimaryBackground', 'flexContainer'],
  navbarContainer: ['padding2x', 'alignCenter', 'bgPrimaryBackground'],
  titleStyle: ['fontXL', 'marginLeft2x', 'marginBottom', 'bold'],
  cancelContainer: ['positionAbsoluteBottom', 'paddingHorizontal2x'],
  contentContainerStyle: { paddingBottom: 200 },
});
export default observer(Interactions);
