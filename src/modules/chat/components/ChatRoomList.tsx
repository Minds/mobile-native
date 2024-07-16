import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import CenteredLoading from '~/common/components/CenteredLoading';
import { IS_IOS } from '~/config/Config';
import sp from '~/services/serviceProvider';

type Props = {
  renderItem: FlashListProps<any>['renderItem'];
  refreshing: boolean;
  onEndReached: FlashListProps<any>['onEndReached'];
  isLoading: boolean;
  onRefresh: () => void;
  Empty: any;
  data: any;
  ListHeaderComponent?: FlashListProps<any>['ListHeaderComponent'];
};

export default function ChatRoomList({
  renderItem,
  refreshing,
  onEndReached,
  isLoading,
  onRefresh,
  Empty,
  data,
  ListHeaderComponent,
}: Props) {
  return (
    <FlashList
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={IS_IOS ? 0 : 80}
          tintColor={sp.styles.getColor('Link')}
          colors={[sp.styles.getColor('Link')]}
        />
      }
      onEndReachedThreshold={0.5}
      estimatedItemSize={68}
      ListEmptyComponent={isLoading ? <CenteredLoading /> : <Empty />}
      onEndReached={onEndReached}
      keyExtractor={keyExtractor}
      data={data}
    />
  );
}

const keyExtractor = item => item.node.id;
