import { useKeyboard, useDimensions } from '@react-native-community/hooks';
import { useState, useEffect, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';

export interface AutoCompleteInput {
  text: string;
  selection: { start: number; end: number };
  textHeight?: number;
  scrollOffset?: number;
  onScrollToOffset?: (offset: number) => void;
  onTextChange: (text: string) => void;
  onSelectionChange: (selection: { start: number; end: number }) => void;
  onTextInputFocus?: () => void;
}

const useAutoComplete = ({
  text,
  selection,
  textHeight = 29,
  scrollOffset = 0,
  onScrollToOffset,
  onTextChange,
  onSelectionChange,
  onTextInputFocus,
}: AutoCompleteInput) => {
  const height = useDimensions().window.height;
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const setVisibleDebounced = useDebouncedCallback(v => setVisible(v), 100, []);
  const keyboard = useKeyboard();

  useEffect(() => {
    const substr = text.substr(0, selection.start) || '';

    /**
     * Distance from top within which we don't have to move the scroll position.
     * in other words, this distance from top is enough to show the popup.
     * this depends on the device obviously.
     **/
    const threshold = (height - keyboard.keyboardHeight) / 3;

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
    (selectedText: string) => {
      let endword: RegExpMatchArray | null = [''],
        matchText = text.substr(0, selection.end);

      // search end of word
      if (text.length > selection.end) {
        endword = text.substr(selection.end).match(/^([a-zA-Z0-9])+\b/);
        if (endword) {
          matchText += endword[0];
        } else {
          endword = [''];
        }
      }

      // the rest of the text
      const preText = matchText.replace(
        new RegExp(`${query[0]}[a-zA-Z0-9]+$`),
        query[0] + selectedText + ' ',
      );
      const postText = text.substr(selection.end + endword[0].length);

      onTextChange(preText + postText);

      onSelectionChange({
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
      text,
      selection.end,
      query,
      onTextChange,
      onSelectionChange,
      onTextInputFocus,
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
