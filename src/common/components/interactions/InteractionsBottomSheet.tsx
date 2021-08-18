import React, { forwardRef } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { observer, useLocalStore } from 'mobx-react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import BaseModel from '../../BaseModel';
import navigationService from '../../../navigation/NavigationService';
import Activity from '../../../newsfeed/activity/Activity';
import UserModel from '../../../channel/UserModel';
import ActivityModel from '../../../newsfeed/ActivityModel';
import OffsetList from '../OffsetList';
import ThemedStyles from '../../../styles/ThemedStyles';
import Handle from '../../../comments/v2/Handle';
import capitalize from '../../helpers/capitalize';
import i18n from '../../services/i18n.service';
import DiscoveryUserV3 from '../../../discovery/DiscoveryUserV3';
import { BottomSheetButton } from '../bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Interactions =
  | 'upVotes'
  | 'downVotes'
  | 'reminds'
  | 'quotes'
  | 'subscribers';

type PropsType = {
  entity: BaseModel;
};

const { height: windowHeight } = Dimensions.get('window');

const snapPoints = [-150, Math.floor(windowHeight * 0.85)];
const renderItemUser = (row: { item: any; index: number }) => {
  return <DiscoveryUserV3 row={row} navigation={navigationService} />;
};
const renderItemActivity = (row: { item: any; index: number }) => {
  return (
    <Activity
      entity={row.item}
      hideTabs={true}
      hideRemind={true}
      navigation={navigationService}
    />
  );
};
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
  const entity = props.entity;
  const store = useLocalStore(() => ({
    visible: false,
    interaction: 'upVotes' as Interactions,
    offset: '' as any,
    show() {
      bottomSheetRef.current?.expand();
      store.visible = true;
    },
    hide() {
      bottomSheetRef.current?.close();
      store.visible = false;
    },
    setInteraction(interaction: Interactions) {
      store.interaction = interaction;
    },
    get endpoint() {
      return store.interaction === 'upVotes' ||
        store.interaction === 'downVotes'
        ? `api/v3/votes/list/${entity.guid}`
        : store.interaction === 'subscribers'
        ? `api/v3/subscriptions/graph/${entity.guid}/subscribers`
        : 'api/v3/newsfeed';
    },
    get opts() {
      const opts: any = {
        limit: 24,
      };

      if (store.interaction === 'reminds') {
        opts.remind_guid = entity.guid;
        opts.hide_reminds = false;
      } else if (store.interaction === 'quotes') {
        opts.quote_guid = entity.guid;
      } else {
        opts.direction = store.interaction === 'upVotes' ? 'up' : 'down';
      }
      return opts;
    },
    get offsetField() {
      let offsetField = 'next-page';
      if (store.interaction === 'subscribers') {
        offsetField = 'from_timestamp';
      }
      return offsetField;
    },
    setOffset(offset: any) {
      this.offset = offset;
    },
  }));
  const isVote =
    store.interaction === 'upVotes' || store.interaction === 'downVotes';

  const isSubscriber = store.interaction === 'subscribers';

  const dataField = isVote ? 'votes' : 'entities';

  // =====================| METHODS |=====================>
  React.useImperativeHandle(ref, () => ({
    show: (interaction: Interactions) => {
      store.setInteraction(interaction);
      store.show();
    },
    hide: () => {
      store.hide();
    },
  }));

  const close = React.useCallback(() => {
    bottomSheetRef.current?.close();
  }, [bottomSheetRef]);

  // =====================| RENDERS |=====================>
  const Header = React.useCallback(() => {
    return (
      <View style={styles.navbarContainer}>
        <Text style={styles.titleStyle}>
          {capitalize(
            i18n.t(`interactions.${store.interaction}`, { count: 2 }),
          )}
        </Text>
      </View>
    );
  }, []);

  const Footer = React.useCallback(() => {
    return (
      <View
        style={[
          styles.cancelContainer,
          { paddingBottom: insets.bottom, paddingTop: insets.bottom * 1.5 },
        ]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          locations={[0, 0.8]}
          colors={['transparent', ThemedStyles.getColor('PrimaryBackground')]}
        />

        <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
      </View>
    );
  }, [store, insets.bottom]);

  /**
   * Custom background
   * (fixes visual issues on Android dark mode)
   */
  const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
    return <View style={style} />;
  };

  const renderBackdrop = React.useCallback(
    props => <BottomSheetBackdrop {...props} pressBehavior="collapse" />,
    [],
  );

  return (
    <BottomSheet
      key="interactionsSheet"
      ref={bottomSheetRef}
      index={0}
      containerHeight={windowHeight}
      snapPoints={snapPoints}
      handleComponent={Handle}
      backgroundComponent={CustomBackground}
      backdropComponent={renderBackdrop}>
      <View style={styles.container}>
        <Header />
        <OffsetList
          fetchEndpoint={store.endpoint}
          endpointData={dataField}
          params={store.opts}
          ListComponent={BottomSheetFlatList}
          // focusHook={useFocusEffect}
          map={isVote ? mapUser : isSubscriber ? mapSubscriber : mapActivity}
          renderItem={
            isVote || isSubscriber ? renderItemUser : renderItemActivity
          }
          offsetField={store.offsetField}
          contentContainerStyle={styles.contentContainerStyle}
        />
        <Footer />
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
