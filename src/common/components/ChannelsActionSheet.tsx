import React, { forwardRef, useCallback } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { observer, useLocalStore } from 'mobx-react';
import { Dimensions, Text, View } from 'react-native';
import navigationService from '../../navigation/NavigationService';
import UserModel from '../../channel/UserModel';
import OffsetList from './OffsetList';
import ThemedStyles from '../../styles/ThemedStyles';
import capitalize from '../helpers/capitalize';
import i18n from '../services/i18n.service';
import ChannelListItem from './ChannelListItem';
import Handle from './bottom-sheet/HandleV2';

type PropsType = {
  channel: UserModel;
};

const { height: windowHeight } = Dimensions.get('window');

const snapPoints = [-150, Math.floor(windowHeight * 0.8)];
const renderItemUser = (row: { item: any; index: number }) => {
  return <ChannelListItem channel={row.item} navigation={navigationService} />;
};
const mapSubscriber = data => data.map(d => UserModel.create(d));

export interface ChannelsActionSheetHandles {
  show(filters: 'subscribers' | 'subscriptions'): void;

  hide(): void;
}

/**
 * Channels Action Sheet
 * @param props
 * @param ref
 */
const ChannelsActionSheet: React.ForwardRefRenderFunction<
  ChannelsActionSheetHandles,
  PropsType
> = (props: PropsType, ref) => {
  // =====================| STATES & VARIABLES |=====================>
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  // const insets = useSafeAreaInsets();
  const store = useLocalStore(() => ({
    offset: '' as any,
    visible: false,
    filter: '',
    show(filter: 'subscribers' | 'subscriptions') {
      bottomSheetRef.current?.expand();
      this.setFilter(filter);
      store.visible = true;
    },
    setFilter(filter: 'subscribers' | 'subscriptions') {
      this.filter = filter;
    },
    hide() {
      store.visible = false;
      bottomSheetRef.current?.close();
    },
    get endpoint() {
      return 'api/v1/subscribe/' + this.filter + '/' + props.channel.guid;
    },
    get opts() {
      const opts: any = {
        limit: 24,
      };

      return opts;
    },
    offsetField: undefined,
    setOffset(offset: any) {
      this.offset = offset;
    },
  }));

  // =====================| METHODS |=====================>
  React.useImperativeHandle(ref, () => ({
    show: (filter: 'subscribers' | 'subscriptions') => {
      store.show(filter);
    },
    hide: () => {
      store.hide();
    },
  }));

  const onBottomSheetChange = useCallback((open: number) => {
    store.visible = !!open;
  }, []);

  // =====================| RENDERS |=====================>
  const Header = React.useCallback(() => {
    return (
      <Handle>
        <View style={styles.navbarContainer}>
          <Text style={styles.titleStyle}>
            {capitalize(i18n.t(store.filter, { count: 2 }))}
          </Text>
        </View>
      </Handle>
    );
  }, [store.filter]);

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
      key="channelsBottomSheet"
      ref={bottomSheetRef}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      index={0}
      onChange={onBottomSheetChange}
      containerHeight={windowHeight}
      snapPoints={snapPoints}
      handleComponent={Header}
      backgroundComponent={CustomBackground}
      backdropComponent={renderBackdrop}>
      {store.visible && (
        <View style={styles.container}>
          <OffsetList
            fetchEndpoint={store.endpoint}
            endpointData={'users'}
            params={store.opts}
            map={mapSubscriber}
            renderItem={renderItemUser}
            offsetField={store.offsetField}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </View>
      )}
    </BottomSheet>
  );
};

const styles = ThemedStyles.create({
  container: ['bgPrimaryBackground', 'flexContainer'],
  navbarContainer: [
    'alignCenter',
    'bgPrimaryBackground',
    'paddingTop2x',
    'paddingBottom',
    {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
  ],
  titleStyle: ['fontXL', 'marginLeft2x', 'marginBottom', 'bold'],
  contentContainerStyle: { paddingBottom: 200 },
});
export default observer(forwardRef(ChannelsActionSheet));
