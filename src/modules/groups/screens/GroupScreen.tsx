import React, { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { useSharedValue } from 'react-native-reanimated';

import { TabView } from 'showtime-tab-view';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabFeedList } from '../components/TabFeedList';
import { ScrollableAutoWidthTabBar } from '../components/AutoWidthTabBar';
import { TabMemberList } from '../components/TabMembersList';
import AnimatedHeader from '../components/AnimatedHeader';
import AnimatedTopHeader from '../components/AnimatedTopHeader';
import GroupModel from '~/groups/GroupModel';
import CenteredLoading from '~/common/components/CenteredLoading';
import {
  GroupScreenContextProvider,
  useGroupContext,
} from '../contexts/GroupContext';
import { useGroup } from '../hooks/useGroup';
import SearchTopBar from '../../../common/components/SearchTopBar';
import CaptureFab from '~/capture/CaptureFab';
import { storages } from '~/common/services/storage/storages.service';
import FeedFilter from '~/common/components/FeedFilter';
import ThemedStyles from '~/styles/ThemedStyles';

const HEADER_HEIGHT = 54;

const FeedScene = ({ route, top }: any) => {
  const groupContext = useGroupContext();
  return groupContext && groupContext.feedStore ? (
    <TabFeedList
      index={route.index}
      feedStore={
        top ? groupContext.feedStore.feedTop : groupContext.feedStore.feed
      }
      displayBoosts="distinct"
      refreshControl={undefined}
    />
  ) : null;
};

const MembersScene = ({ route, group }: any) => {
  return (
    <TabMemberList
      style={ThemedStyles.style.flexContainer}
      index={route.index}
      group={group}
    />
  );
};

const routes = [
  { key: 'feed', title: 'Latest', index: 0 },
  { key: 'top', title: 'Top', index: 1 },
  { key: 'members', title: 'Members', index: 2 },
];

const PostToGroupButton = observer(({ navigation }) => {
  const groupContext = useGroupContext();
  return (
    <CaptureFab
      visible={true}
      navigation={navigation}
      group={groupContext?.group}
    />
  );
});

export function GroupScreen({ route, navigation }) {
  const groupGuid = route.params.guid || route.params?.group?.guid;
  const group = useGroup({ guid: groupGuid, group: route.params?.group });

  return group ? (
    <GroupScreenContextProvider group={group}>
      <GroupScreenView group={group} />
      <PostToGroupButton navigation={navigation} />
    </GroupScreenContextProvider>
  ) : (
    <CenteredLoading />
  );
}

const GroupScreenView = observer(({ group }: { group: GroupModel }) => {
  const initialTab = useRef(-1);

  // initial loading
  if (initialTab.current === -1) {
    initialTab.current = storages.user?.getInt('GroupTab') || 0;
  }

  const [index, setIndex] = useState(initialTab.current);

  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const { top } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const groupContext = useGroupContext();

  const onStartRefresh = async () => {
    if (index === 0) {
      groupContext?.feedStore?.feed.refresh();
    } else if (index === 1) {
      groupContext?.feedStore?.feedTop.refresh();
    } else {
      groupContext?.feedMembersStore?.refresh();
    }
  };

  const isRefreshing =
    index === 0
      ? groupContext?.feedStore?.feed.refreshing
      : index === 1
      ? groupContext?.feedStore?.feedTop.refreshing
      : groupContext?.feedMembersStore?.members.refreshing;

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case 'feed':
          return <FeedScene route={route} group={group} />;
        case 'top':
          return <FeedScene route={route} group={group} top />;
        case 'members':
          return <MembersScene route={route} group={group} />;
        default:
          return null;
      }
    },
    [group],
  );

  const renderHeader = useCallback(
    () => (
      <AnimatedHeader
        top={top}
        group={group}
        animationHeaderPosition={animationHeaderPosition}
        animationHeaderHeight={animationHeaderHeight}
      />
    ),
    [animationHeaderHeight, animationHeaderPosition, group, top],
  );

  const onIndexChange = useCallback(idx => {
    setIndex(idx);
    storages.user?.setInt('GroupTab', idx);
  }, []);

  const renderTabBar = useCallback(
    props => (
      <>
        <ScrollableAutoWidthTabBar {...props} />
        {groupContext?.feedStore && index === 0 && (
          <FeedFilter
            store={groupContext?.feedStore}
            hideLabel
            hideBlogs
            containerStyles={styles.filterStyle}
          />
        )}
      </>
    ),
    [groupContext?.feedStore, index],
  );

  const minHeaderHeight = Platform.select({
    default: headerHeight ? headerHeight : HEADER_HEIGHT + top,
    android: headerHeight ? 0 : HEADER_HEIGHT + top,
  });

  const currentStore =
    index === 2 ? groupContext?.feedMembersStore : groupContext?.feedStore;

  return (
    <>
      <TabView
        onStartRefresh={onStartRefresh}
        isRefreshing={isRefreshing}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        renderTabBar={renderTabBar}
        lazy
        renderScrollHeader={renderHeader}
        refreshHeight={top + HEADER_HEIGHT + 300}
        minHeaderHeight={minHeaderHeight}
        overridenShareAnimatedValue={scrollY}
        animationHeaderPosition={animationHeaderPosition}
        animationHeaderHeight={animationHeaderHeight}
      />
      <AnimatedTopHeader
        top={top}
        group={group}
        scrollY={scrollY}
        animationHeaderHeight={animationHeaderHeight}
        currentStore={currentStore}
      />
      <SearchTopBar
        visible={currentStore?.showSearch}
        placeholder="Search Group"
        onClosePress={() => currentStore?.toggleSearch()}
        onSubmitEditing={e => currentStore?.setSearch(e.nativeEvent.text)}
      />
    </>
  );
});

const styles = StyleSheet.create({
  filterStyle: {
    position: 'absolute',
    top: 12,
    right: 20,
    zIndex: 999,
  },
});
