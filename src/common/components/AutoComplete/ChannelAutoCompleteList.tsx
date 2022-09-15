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
   * when a channel is selected,
   **/
  onSelect?: (selectedText: string, channel: UserModel) => void;
  /**
   * a custom component to use instead of flat list
   */
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
  }, [channels, length, onChannels]);

  const renderItem = useCallback(
    ({ item }) => (
      <ChannelListItem
        channel={item}
        hideButtons
        onPress={user => onSelect?.(user.username, user)}
      />
    ),
    [onSelect],
  );

  const CustomFlatList = (flatListComponent || FlatList) as any;

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
