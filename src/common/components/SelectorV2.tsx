import React, {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Keyboard, TextStyle, View, ViewProps } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
} from './bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import MText from './MText';
import sp from '~/services/serviceProvider';

/**
 * a View that has two linear gradients on top and bottom
 **/
const GradientView: FC<ViewProps> = ({ children, ...props }) => {
  const backgroundColor = sp.styles.getColor('PrimaryBackgroundHighlight');
  const endColor = (sp.styles.theme ? '#242A30' : '#F5F5F5') + '00';
  const startColor = backgroundColor + 'FF';
  return (
    <View {...props}>
      {children}
      <LinearGradient
        colors={[startColor, endColor]}
        style={topGradientStyle}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[endColor, startColor]}
        style={bottomGradientStyle}
        pointerEvents="none"
      />
    </View>
  );
};

export type SelectorPropsType = {
  data: Array<Object>;
  valueExtractor: (item: any) => JSX.Element | string;
  keyExtractor: (item: any) => string;
  title?: string;
  onItemSelect: Function;
  textStyle?: TextStyle | TextStyle[];
  backdropOpacity?: number;
  children?: (onItemSelect: any) => any;
};

/**
 * Selector with BottomSheetModal
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
const SelectorV2: ForwardRefRenderFunction<any, SelectorPropsType> = (
  { title, data, keyExtractor, valueExtractor, onItemSelect, children },
  ref,
) => {
  const i18n = sp.i18n;
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
  const theme = sp.styles.style;
  /**
   * only show the gradient view if we had more than 5 items. this may be
   * a naive logic
   **/
  const showGradientView = data.length > 5;
  /**
   * we want to handle top and bottom paddings, and a correct
   * scrollToIndex behavior. we do this to hit two birds with
   * one stone
   **/
  const listData = useMemo(
    () => (showGradientView ? ['', ...data, ''] : data),
    [data],
  );

  // =====================| REFS |==========================>
  const bottomSheetRef = useRef<any>();
  const flatListRef = useRef<any>();

  // =====================| FUNCTIONS |==========================>
  /**
   * Shows or hides the BottomSheetModal while optionally receiving a an item
   * if an item was given, it makes that item selected
   * it also scrolls to the selected item
   **/
  const show = useCallback(
    (item?) => {
      setShown(true);
      // dismiss the keyboard if it's open
      Keyboard.dismiss();
      setSelected(item);

      // SCROLL TO INDEX IF SELECTED
      setTimeout(() => {
        if (item) {
          const itemToScrollTo = data.find(i => keyExtractor(i) === item);
          if (itemToScrollTo) {
            flatListRef.current?.scrollToIndex({
              animated: true,
              index: data.indexOf(itemToScrollTo) || 0,
            });
          }
        }
      }, 500);
    },
    [data, keyExtractor],
  );

  /**
   * Closes the BottomSheetModal
   **/
  const close = useCallback(() => setShown(false), []);

  /**
   * Renders the FlatList item
   **/
  const renderItem = useCallback(
    ({ item, index }) => {
      if (item === '') {
        return <View style={{ height: gradientHeight }} key={index} />;
      }

      const isSelected = item => selected === keyExtractor(item);

      const onMenuItemPress = () => {
        if (item.onPress) {
          item.onPress();
        } else {
          onItemSelect(item);
          close();
        }
      };

      const textStyle = isSelected(item)
        ? theme.colorLink
        : theme.colorPrimaryText;

      return (
        <BottomSheetMenuItem
          key={keyExtractor(item)}
          onPress={onMenuItemPress}
          textStyle={textStyle}
          iconName={item.iconName}
          title={valueExtractor(item)}
          style={styles.menuItem}
        />
      );
    },
    [
      theme.colorLink,
      theme.colorPrimaryText,
      keyExtractor,
      valueExtractor,
      selected,
      close,
      onItemSelect,
    ],
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
  const flatList = (
    <FlatList
      data={listData}
      renderItem={renderItem}
      extraData={selected}
      style={styles.flatList}
      ref={flatListRef}
      keyExtractor={keyExtractor}
      onScrollToIndexFailed={onScrollToIndexFailed}
    />
  );

  const modal = shown ? (
    <BottomSheetModal ref={bottomSheetRef} autoShow onDismiss={close}>
      {Boolean(title) && <MText style={styles.title}>{title}</MText>}
      {showGradientView ? <GradientView>{flatList}</GradientView> : flatList}
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheetModal>
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

const gradientHeight = 100;

const styles = sp.styles.create({
  menuItem: ['paddingHorizontal5x', 'rowJustifyCenter'],
  flatList: { maxHeight: 300, overflow: 'scroll' },
  title: [
    'colorPrimaryText',
    'fontXXL',
    'centered',
    'marginLeft5x',
    'marginBottom2x',
  ],
  linear: {
    height: gradientHeight,
    width: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

const topGradientStyle = sp.styles.combine(styles.linear, styles.topGradient);
const bottomGradientStyle = sp.styles.combine(
  styles.linear,
  styles.bottomGradient,
);
