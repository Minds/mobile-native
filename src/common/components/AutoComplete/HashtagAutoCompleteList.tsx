import React, { useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import ThemedStyles from '~styles/ThemedStyles';
import { observer } from 'mobx-react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import useSuggestedHashtags from './useSuggestedHashtags';
import { B1 } from '~/common/ui';
import MPressable from '../MPressable';

export interface ChannelAutoCompleteListProps {
  /**
   * query to search
   **/
  query: string;
  /**
   * called when channels were load
   **/
  onTags?: (tags: string[]) => void;
  /**
   * when a channel is selected
   **/
  onSelect?: (tag: string) => void;
  /**
   * a custom component to use instead of flat list
   */
  flatListComponent?: FlatList | typeof BottomSheetFlatList;
}

function ChannelAutoCompleteList({
  query,
  onTags,
  onSelect,
  flatListComponent,
}: ChannelAutoCompleteListProps) {
  const { result } = useSuggestedHashtags(query);
  const tags = result?.tags || [];
  const length = tags.length;

  useEffect(() => {
    onTags?.(tags || []);
  }, [tags, length, onTags]);

  const renderItem = useCallback(
    ({ item }) => <HashtagListItem tag={item} onPress={onSelect} />,
    [onSelect],
  );

  const CustomFlatList = (flatListComponent || FlatList) as any;

  // TODO: add loading state
  // TODO: add error state
  return (
    <CustomFlatList
      keyboardShouldPersistTaps={'always'}
      keyboardDismissMode={'none'}
      data={tags}
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

const HashtagListItem = ({
  tag,
  onPress,
}: {
  tag: string;
  onPress?: (selectedTag: string) => void;
}) => {
  return (
    <MPressable
      style={styles.container}
      onPress={useCallback(() => onPress?.(tag), [onPress, tag])}>
      <B1>#{tag}</B1>
    </MPressable>
  );
};

const styles = ThemedStyles.create({
  container: [
    {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingVertical: 17,
    },
    'paddingHorizontal2x',
    'paddingLeft4x',
    'bcolorPrimaryBorder',
    'borderBottom1x',
  ],
});
