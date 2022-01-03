import React, { useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import ChannelListItem from '~/common/components/ChannelListItem';
import ThemedStyles from '~styles/ThemedStyles';
import UserModel from '~/channel/UserModel';
import { observer } from 'mobx-react';
import useChannelSuggestion from './useChannelSuggestion';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

export interface ChannelAutoCompleteListProps {
  /**
   * query to search
   **/
  query: string;
  /**
   * called when channels were load
   **/
  onChannels?: (channels: UserModel[]) => void;
  /**
   * when a channel is selected
   **/
  onSelect?: (channel: UserModel) => void;
  flatListComponent?: FlatList | typeof BottomSheetFlatList;
}

function ChannelAutoCompleteList({
  query,
  onChannels,
  onSelect,
  flatListComponent,
}: ChannelAutoCompleteListProps) {
  const { result } = useChannelSuggestion(query);
  const channels = result?.entities || [];
  const length = channels.length;

  useEffect(() => {
    onChannels?.(channels || []);
  }, [channels, length]);

  const renderItem = useCallback(
    ({ item }) => (
      <ChannelListItem channel={item} hideButtons onPress={onSelect} />
    ),
    [onSelect],
  );

  const CustomFlatList = (flatListComponent || FlatList) as any;

  // TODO: add empty state
  // TODO: add loading state
  // TODO: add error state
  return (
    <CustomFlatList
      keyboardShouldPersistTaps={'always'}
      keyboardDismissMode={'none'}
      data={channels}
      renderItem={renderItem}
      keyExtractor={item => item.guid}
      contentContainerStyle={contentContainerStyle}
      style={ThemedStyles.style.bgPrimaryBackgroundHighlight}
    />
  );
}

const contentContainerStyle = ThemedStyles.combine(
  'borderTop',
  'bcolorPrimaryBorder',
);

export default observer(ChannelAutoCompleteList);
