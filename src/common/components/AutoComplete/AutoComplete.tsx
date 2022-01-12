import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import ChannelAutoCompleteList from './ChannelAutoCompleteList';
import HashtagAutoCompleteList from './HashtagAutoCompleteList';
import useAutoComplete, { AutoCompleteInput } from './useAutoComplete';

interface AutoCompleteProps extends AutoCompleteInput {
  onVisible: (visible: boolean) => void;
  /**
   * a custom component to use instead of flat list
   */
  flatListComponent?: FlatList | typeof BottomSheetFlatList;
}

function AutoComplete(props: AutoCompleteProps) {
  const {
    query,
    handleAutoCompleteSelect,
    handleAutoCompleteLoaded,
    visible,
  } = useAutoComplete(props);

  useEffect(() => props.onVisible?.(visible), [visible]);

  if (!query) {
    return null;
  }

  if (query[0] === '@') {
    return (
      <ChannelAutoCompleteList
        onChannels={handleAutoCompleteLoaded}
        query={query}
        onSelect={handleAutoCompleteSelect}
        flatListComponent={props.flatListComponent}
      />
    );
  } else if (query[0] === '#') {
    return (
      <HashtagAutoCompleteList
        onTags={handleAutoCompleteLoaded}
        query={query}
        onSelect={handleAutoCompleteSelect}
        flatListComponent={props.flatListComponent}
      />
    );
  }

  return null;
}

export default observer(AutoComplete);
