import { useKeyboard } from '@react-native-community/hooks';
import { useState, useEffect, useCallback } from 'react';
import { InteractionManager, useWindowDimensions } from 'react-native';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';
import UserModel from '../../../channel/UserModel';
import { AutoCompleteProps } from './AutoComplete';

const useAutoComplete = ({
  text,
  selection,
  textHeight = 29,
  scrollOffset = 0,
  onScrollToOffset,
  onTextChange,
  onChannelSelect,
  onSelectionChange,
  onTextInputFocus,
  onVisible,
}: AutoCompleteProps) => {
  const height = useWindowDimensions().height;
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const setVisibleDebounced = useDebouncedCallback(v => setVisible(v), 100, []);
  const keyboard = useKeyboard();

  useEffect(() => onVisible?.(visible), [visible, onVisible]);

  useEffect(() => {
    const substr = (selection ? text.substr(0, selection.start) : text) || '';

    const lastItem = substr
      .replace(/\n/g, ' ') // replace with space
      .split(' ')
      .reverse()[0];

    if (
      lastItem &&
      (lastItem[0] === '@' || lastItem[0] === '#') &&
      lastItem.length > 1
    ) {
      setVisibleDebounced(true);
      /**
       * Distance from top within which we don't have to move the scroll position.
       * in other words, this distance from top is enough to show the popup.
       * this depends on the device obviously.
       **/
      const threshold = (height - keyboard.keyboardHeight) / 3;

      if (textHeight - scrollOffset > threshold) {
        onScrollToOffset?.(textHeight - 29);
      }
      setQuery(lastItem);
    } else {
      setVisibleDebounced(false);
      setQuery('');
    }
  }, [
    keyboard.keyboardHeight,
    setVisibleDebounced,
    onScrollToOffset,
    scrollOffset,
    selection,
    text,
    textHeight,
    height,
  ]);

  const [autoCompleteLoaded, setAutoCompleteLoaded] = useState(false);
  const handleAutoCompleteLoaded = useCallback(
    (items: any[]) => setAutoCompleteLoaded(Boolean(items.length)),
    [],
  );
  const handleAutoCompleteSelect = useCallback(
    (selectedText: string, selectedChannel?: UserModel) => {
      let endword: RegExpMatchArray | null = [''],
        matchText = selection ? text.substr(0, selection.end) : text;

      if (selection) {
        // search end of word
        if (text.length > selection.end) {
          endword = text.substr(selection.end).match(/^([a-zA-Z0-9])+\b/);
          if (endword) {
            matchText += endword[0];
          } else {
            endword = [''];
          }
        }
      }

      const tag = query[0] as '@' | '#';
      // the rest of the text
      const preText = matchText.replace(
        new RegExp(`${tag}[a-zA-Z0-9]+$`),
        tag + selectedText + ' ',
      );
      const postText = selection
        ? text.substr(selection.end + endword[0].length)
        : '';

      onTextChange(preText + postText);
      if (selectedChannel) {
        onChannelSelect?.(selectedChannel);
      }

      onSelectionChange?.({
        start: preText.length,
        end: preText.length,
      });
      if (onTextInputFocus) {
        InteractionManager.runAfterInteractions(() => {
          onTextInputFocus();
        });
      }
    },
    [
      selection,
      text,
      query,
      onTextChange,
      onSelectionChange,
      onTextInputFocus,
      onChannelSelect,
    ],
  );

  return {
    visible: visible && autoCompleteLoaded,
    query,
    handleAutoCompleteSelect,
    handleAutoCompleteLoaded,
  };
};

export default useAutoComplete;
