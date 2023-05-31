import type { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React from 'react';
import type { FlatList } from 'react-native';

import type UserModel from '~/channel/UserModel';
import ChannelAutoCompleteList from './ChannelAutoCompleteList';
import HashtagAutoCompleteList from './HashtagAutoCompleteList';
import useAutoComplete from './useAutoComplete';

export interface AutoCompleteProps {
  text: string;
  selection?: { start: number; end: number };
  textHeight?: number;
  scrollOffset?: number;
  onScrollToOffset?: (offset: number) => void;
  onTextChange: (text: string) => void;
  onChannelSelect?: (channel: UserModel) => void;
  onSelectionChange?: (selection: { start: number; end: number }) => void;
  onTextInputFocus?: () => void;
  onVisible?: (boolean) => void;
  flatListComponent?: FlatList | typeof BottomSheetFlatList;
}

function AutoComplete(props: AutoCompleteProps) {
  const { query, handleAutoCompleteSelect, handleAutoCompleteLoaded } =
    useAutoComplete(props);

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
