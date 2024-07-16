import React, { useCallback, useEffect } from 'react';
import { FlatList, View } from 'react-native';

import { observer } from 'mobx-react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import useSuggestedHashtags from './useSuggestedHashtags';
import { B1 } from '~/common/ui';
import MPressable from '../MPressable';
import sp from '~/services/serviceProvider';

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
  const { result, loaded } = useSuggestedHashtags(query);
  const tags = React.useMemo(() => result?.tags || [], [result]);
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
      ListEmptyComponent={loaded ? Empty : null}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      style={sp.styles.style.bgPrimaryBackgroundHighlight}
    />
  );
}

const Empty = () => (
  <View style={styles.empty}>
    <B1>No matching tags found</B1>
  </View>
);

const contentContainerStyle = sp.styles.combine(
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

const styles = sp.styles.create({
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
  empty: ['flexContainerCenter', 'padding4x'],
});

const keyExtractor = item => item;
