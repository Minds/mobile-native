import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Text, TextStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ThemedStyles from '../../styles/ThemedStyles';
import { BottomSheet, BottomSheetButton, MenuItem } from './bottom-sheet';
import i18n from '../../common/services/i18n.service';

type PropsType = {
  data: Array<Object>;
  valueExtractor: (item: any) => string;
  keyExtractor: (item: any) => string;
  title?: string;
  onItemSelect: Function;
  textStyle?: TextStyle | TextStyle[];
  backdropOpacity?: number;
  children?: (onItemSelect: any) => any;
};

/**
 * Selector with BottomSheet
 *
 * It is used as such:
 * ```
 *  <Selector ...props>
 *    {show => (
 *      <Button onPress={show} />
 *    )}
 *  </Selector>
 * ```
 *
 * Or alternatively without children
 * ```
 *  <Selector ref={selectorRef} />
 *
 *  selectorRef.current.show()
 * ```
 **/
const SelectorV2: ForwardRefRenderFunction<any, PropsType> = (
  { title, data, keyExtractor, valueExtractor, onItemSelect, children },
  ref,
) => {
  // =====================| STATES |==========================>
  /**
   * Is the bottomSheet visible?
   **/
  const [shown, setShown] = useState(false);
  /**
   * Shows the currently selected item
   **/
  const [selected, setSelected] = useState('');

  // =====================| VARIABLES |==========================>
  const theme = ThemedStyles.style;

  // =====================| REFS |==========================>
  const bottomSheetRef = useRef<any>();
  const flatListRef = useRef<any>();

  // =====================| FUNCTIONS |==========================>
  /**
   * Shows or hides the BottomSheet while optionally receiving a an item
   * if an item was given, it makes that item selected
   * it also scrolls to the selected item
   **/
  const show = useCallback(
    (item?) => {
      setShown(true);
      setSelected(item);

      // SCROLL TO INDEX IF SELECTED
      setTimeout(() => {
        if (selected) {
          const itemToScrollTo = data.find(
            item => keyExtractor(item) === selected,
          );
          flatListRef.current?.scrollToIndex({
            animated: true,
            index: data.indexOf(itemToScrollTo || 0),
          });
        }
      }, 500);
    },
    [selected, keyExtractor, selected, flatListRef, data],
  );

  /**
   * Closes the BottomSheet
   **/
  const close = useCallback(() => setShown(false), []);

  /**
   * Renders the FlatList item
   **/
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item => selected === keyExtractor(item);

      const onMenuItemPress = () => {
        onItemSelect(item);
        close();
      };

      const textStyle = isSelected(item)
        ? { color: theme.colorLink }
        : { color: theme.colorPrimaryText };

      return (
        <MenuItem
          key={keyExtractor(item)}
          onPress={onMenuItemPress}
          textStyle={textStyle}
          title={valueExtractor(item)}
          style={styles.menuItem}
        />
      );
    },
    [selected, onItemSelect],
  );

  /**
   * This function is called when the scroll to index fails
   **/
  const onScrollToIndexFailed = useCallback(
    () => flatListRef.current?.scrollToEnd(),
    [flatListRef],
  );

  /**
   * Imperative handles to call show and close functions
   * from outside
   **/
  useImperativeHandle(ref, () => ({
    show,
    close,
  }));

  // =====================| RENDER |==========================>
  const modal = shown ? (
    <BottomSheet ref={bottomSheetRef} autoShow onDismiss={close}>
      {Boolean(title) && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={data}
        renderItem={renderItem}
        extraData={selected}
        style={styles.flatList}
        ref={flatListRef}
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheet>
  ) : null;

  if (children) {
    return (
      <>
        {children(show)}
        {modal}
      </>
    );
  }

  return modal;
};

export default forwardRef(SelectorV2);

const styles = ThemedStyles.create({
  menuItem: ['paddingHorizontal5x', 'rowJustifyCenter'],
  flatList: { maxHeight: 300, overflow: 'scroll' },
  title: ['colorPrimaryText', 'fontXXL', 'centered', 'marginLeft5x'],
});
