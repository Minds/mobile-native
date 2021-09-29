import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { observer, useLocalStore } from 'mobx-react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import BaseModel from '../../BaseModel';
import navigationService from '../../../navigation/NavigationService';
import Activity from '../../../newsfeed/activity/Activity';
import UserModel from '../../../channel/UserModel';
import ActivityModel from '../../../newsfeed/ActivityModel';
import OffsetList from '../OffsetList';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import capitalize from '../../helpers/capitalize';
import i18n from '../../services/i18n.service';
import { BottomSheetButton } from '../bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ChannelListItem from '../ChannelListItem';
import Handle from '../bottom-sheet/Handle';
import ChannelListItemPlaceholder from '../ChannelListItemPlaceholder';
import ActivityPlaceHolder from '../../../newsfeed/ActivityPlaceHolder';
import MText from '../MText';

type Interactions =
  | 'upVotes'
  | 'downVotes'
  | 'reminds'
  | 'quotes'
  | 'channelSubscribers'
  | 'channelSubscriptions'
  | 'subscribers';

type PropsType = {
  entity: BaseModel;
};

const { height: windowHeight } = Dimensions.get('window');

const snapPoints = [Math.floor(windowHeight * 0.8)];
const renderItemUser = (row: { item: any; index: number }) => (
  <ChannelListItem channel={row.item} navigation={navigationService} />
);
const renderItemActivity = (row: { item: any; index: number }) => (
  <Activity
    entity={row.item}
    hideTabs={true}
    hideRemind={true}
    navigation={navigationService}
  />
);

const mapUser = data => data.map(d => UserModel.create(d.actor));
const mapSubscriber = data => data.map(d => UserModel.create(d));
const mapActivity = data =>
  data.map(d => {
    return ActivityModel.create(d);
  });

export interface InteractionsActionSheetHandles {
  show(interactions: Interactions): void;

  hide(): void;
}

/**
 * Interactions Action Sheet
 * @param props
 * @param ref
 */
const InteractionsBottomSheet: React.ForwardRefRenderFunction<
  InteractionsActionSheetHandles,
  PropsType
> = (props: PropsType, ref) => {
  // =====================| STATES & VARIABLES |=====================>
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const footerStyle = useStyle(styles.cancelContainer, {
    paddingBottom:
      insets.bottom + Platform.select({ default: 25, android: 45 }),
    paddingTop: insets.bottom * 1.5,
  });
  const footerGradientColors = useMemo(
    () => [
      ThemedStyles.getColor('PrimaryBackground') + '00',
      ThemedStyles.getColor('PrimaryBackground'),
    ],
    [ThemedStyles.theme],
  );
  const entity = props.entity;
  const offsetListRef = useRef<any>();
  const store = useLocalStore(() => ({
    visible: false,
    interaction: 'upVotes' as Interactions,
    offset: '' as any,
    setVisibility(visible: boolean) {
      this.visible = visible;
    },
    show() {
      bottomSheetRef.current?.expand();
      store.visible = true;
    },
    hide() {
      bottomSheetRef.current?.close();
      /**
       * we don't turn visibility off, because then
       * the offsetlist will be unmounted and the data,
       * will be reset. we want to keep the data
       **/
      // store.visible = false;
    },
    setInteraction(interaction: Interactions) {
      store.interaction = interaction;
    },
    get endpoint() {
      switch (store.interaction) {
        case 'upVotes':
        case 'downVotes':
          return `api/v3/votes/list/${entity.guid}`;
        case 'subscribers':
          return `api/v3/subscriptions/graph/${entity.guid}/subscribers`;
        case 'channelSubscribers':
          return 'api/v1/subscribe/subscribers/' + entity.guid;
        case 'channelSubscriptions':
          return 'api/v1/subscribe/subscriptions/' + entity.guid;
        default:
          return 'api/v3/newsfeed';
      }
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
        default:
          opts.direction = store.interaction === 'upVotes' ? 'up' : 'down';
          break;
      }

      return opts;
    },
    get offsetField() {
      let offsetField: string | undefined = 'next-page';
      if (store.interaction === 'subscribers') {
        offsetField = 'from_timestamp';
      }
      if (
        store.interaction === 'channelSubscribers' ||
        store.interaction === 'channelSubscriptions'
      ) {
        offsetField = undefined;
      }
      return offsetField;
    },
    setOffset(offset: any) {
      this.offset = offset;
    },
  }));
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  const isVote =
    store.interaction === 'upVotes' || store.interaction === 'downVotes';
  const isChannels =
    store.interaction === 'subscribers' ||
    store.interaction === 'channelSubscriptions' ||
    store.interaction === 'channelSubscribers';
  let dataField = isVote ? 'votes' : 'entities';
  if (
    store.interaction === 'channelSubscriptions' ||
    store.interaction === 'channelSubscribers'
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
  React.useImperativeHandle(ref, () => ({
    show: (interaction: Interactions) => {
      store.setInteraction(interaction);
      /**
       * if the list was already visible, refresh its existing data,
       * other wise just show the list
       **/
      if (store.visible) {
        // refresh the offset list
        offsetListRef.current?.refreshList();
      }
      store.show();
    },
    hide: () => {
      store.hide();
    },
  }));

  const close = React.useCallback(
    () => bottomSheetRef.current?.close(),
    [bottomSheetRef],
  );

  /**
   * only turn visibility on, never off.
   * because we don't turn visibility off. because then
   * the offsetlist will be unmounted and the data,
   * will be reset. we want to keep the data
   **/
  const onBottomSheetVisibilityChange = useCallback((visible: number) => {
    if (Boolean(visible)) {
      store.setVisibility(Boolean(visible));
    }
  }, []);

  const title = useMemo(() => {
    switch (store.interaction) {
      case 'channelSubscribers':
        return i18n.t('subscribers');
      case 'channelSubscriptions':
        return i18n.t('subscriptions');
      default:
        return i18n.t(`interactions.${store.interaction}`, { count: 2 });
    }
  }, [store.interaction]);

  // =====================| RENDERS |=====================>
  const Header = useCallback(
    () => (
      <Handle>
        <View style={styles.navbarContainer}>
          <MText style={styles.titleStyle}>{capitalize(title)}</MText>
        </View>
      </Handle>
    ),
    [store.interaction, title],
  );

  const footer = (
    <View style={footerStyle} pointerEvents={'box-none'}>
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={footerGradientColors}
        pointerEvents={'none'}
      />
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </View>
  );

  const renderPlaceholder = useCallback(() => {
    if (isVote || isChannels) {
      return <ChannelListItemPlaceholder />;
    }

    return <ActivityPlaceHolder />;
  }, [isVote, isChannels]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      containerHeight={windowHeight}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleComponent={Header}
      // enableContentPanningGesture={false}
      // enableHandlePanningGesture={true}
      onChange={onBottomSheetVisibilityChange}
      backgroundComponent={null}
      backdropComponent={renderBackdrop}>
      <View style={styles.container}>
        {store.visible && (
          <>
            <OffsetList
              ref={offsetListRef}
              fetchEndpoint={store.endpoint}
              endpointData={dataField}
              params={store.opts}
              placeholderCount={placeholderCount}
              renderPlaceholder={renderPlaceholder}
              // focusHook={useFocusEffect}
              map={isVote ? mapUser : isChannels ? mapSubscriber : mapActivity}
              renderItem={
                isVote || isChannels ? renderItemUser : renderItemActivity
              }
              offsetField={store.offsetField}
              contentContainerStyle={styles.contentContainerStyle}
            />
            {footer}
          </>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = ThemedStyles.create({
  container: ['bgPrimaryBackground', 'flexContainer'],
  navbarContainer: ['padding2x', 'alignCenter', 'bgPrimaryBackground'],
  titleStyle: ['fontXL', 'marginLeft2x', 'marginBottom', 'bold'],
  cancelContainer: ['positionAbsoluteBottom', 'paddingHorizontal2x'],
  contentContainerStyle: { paddingBottom: 200 },
});
export default observer(forwardRef(InteractionsBottomSheet));
