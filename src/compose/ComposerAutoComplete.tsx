import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  InteractionManager,
  ScrollView,
  TextInput as TextInputType,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { observer } from 'mobx-react';
import { useKeyboard } from '@react-native-community/hooks';

import { ComposeStoreType } from './useComposeStore';
import AutoComplete, {
  AutoCompleteProps,
} from '~/common/components/AutoComplete/AutoComplete';

const { height } = Dimensions.get('window');

export const ComposerAutoComplete = observer(
  ({
    store,
    handleTextInputFocus,
    inputRef,
    scrollViewRef,
  }: {
    store: ComposeStoreType;
    scrollViewRef: React.RefObject<ScrollView>;
    inputRef: React.RefObject<TextInputType>;
    handleTextInputFocus: AutoCompleteProps['onTextInputFocus'];
  }) => {
    const keyboard = useKeyboard();
    const [autoCompleteVisible, setAutoCompleteVisible] = useState(false);
    const handleSelectionChange = useCallback(() => {
      selection => {
        store.setSelection(selection);
        setTimeout(() => {
          inputRef.current?.setNativeProps({
            selection: {
              start: selection.start,
              end: selection.end,
            },
          });
        });
      };
    }, [inputRef, store]);

    const onAutoCompleteShown = useCallback(
      (visible: boolean) => {
        setAutoCompleteVisible(visible);
        if (visible) {
          setTimeout(() => {
            InteractionManager.runAfterInteractions(() =>
              scrollViewRef.current?.scrollTo(store.textHeight + 35),
            );
          }, 350);
        }
      },
      [scrollViewRef, store.textHeight],
    );
    /**
     * animated style for the popover appearing and disappearing functionality
     **/
    const autoCompletePopupAnimatedStyle = useAnimatedStyle(
      () => ({
        height: withTiming(
          autoCompleteVisible
            ? (height -
                (keyboard.keyboardShown ? keyboard.keyboardHeight : 0)) /
                2
            : 0,
        ),
      }),
      [autoCompleteVisible, keyboard],
    );
    return (
      <Animated.View style={autoCompletePopupAnimatedStyle}>
        <AutoComplete
          textHeight={store.textHeight}
          scrollOffset={store.scrollOffset}
          selection={store.selection}
          onSelectionChange={handleSelectionChange}
          text={store.text}
          onTextChange={store.setText}
          onTextInputFocus={handleTextInputFocus}
          onScrollToOffset={offset =>
            scrollViewRef.current?.scrollTo({
              y: offset,
            })
          }
          onVisible={onAutoCompleteShown}
        />
      </Animated.View>
    );
  },
);
