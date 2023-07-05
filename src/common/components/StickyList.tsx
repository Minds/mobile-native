import { useLayout } from '@react-native-community/hooks';
import React, { useEffect, useState } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollContext, ScrollDirection } from '../contexts/scroll.context';
import { StyleSheet, View } from 'react-native';

type StickyListProps = {
  header?: React.ReactElement;
  bottomComponent?: React.ReactNode;
  children: (props: any) => React.ReactNode;
};

/**
 * A list with reanimated sticky header
 */
function StickyList(props: StickyListProps, ref: any) {
  const translationY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const scrollDirection = useSharedValue<ScrollDirection>(
    ScrollDirection.neutral,
  );
  const { header, ...otherProps } = props;

  /**
   * headerHeight - set by the header layout
   */
  const [headerHeight, setHeaderHeight] = useState(0);

  /**
   * Scroll handler
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      // if negative (refresh or bounce)
      if (event.contentOffset.y <= 0) {
        translationY.value = event.contentOffset.y;
      } else {
        if (dragging.value || event.contentOffset.y < headerHeight) {
          // is down
          const delta = scrollY.value - event.contentOffset.y;
          translationY.value = translationY.value - delta;
          if (translationY.value < 0) {
            translationY.value = 0;
          }
          if (translationY.value > headerHeight) {
            translationY.value = headerHeight;
          }
        }
      }
      if (
        Math.abs(event.contentOffset.y - scrollY.value) > MIN_SCROLL_THRESHOLD
      ) {
        scrollDirection.value =
          event.contentOffset.y > scrollY.value
            ? ScrollDirection.down
            : ScrollDirection.up;
      }
      scrollY.value = event.contentOffset.y;
    },
    onBeginDrag() {
      dragging.value = true;
    },
    onEndDrag(event) {
      dragging.value = false;
      // if the scroll is bigger than the header height and the header is partially shown we make it sticky
      if (
        event.contentOffset.y > headerHeight &&
        translationY.value > 0 &&
        translationY.value < headerHeight
      ) {
        translationY.value = withTiming(
          translationY.value < headerHeight / 2 ? 0 : headerHeight,
        );
      }
    },
  });

  const contentStyle = React.useMemo(
    () => ({ paddingTop: headerHeight }),
    [headerHeight],
  );

  return (
    <ScrollContext.Provider
      value={{ translationY, scrollY, headerHeight, scrollDirection }}>
      <View style={styles.container}>
        {props.children({
          ref: ref,
          ...otherProps,
          ListComponent: Animated.FlatList,
          onScroll: scrollHandler,
          contentContainerStyle: contentStyle,
        })}
        <Header translationY={translationY} onHeight={setHeaderHeight}>
          {header}
        </Header>
        {props.bottomComponent}
      </View>
    </ScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
});

/**
 * Animated header
 */
const Header = ({ children, translationY, onHeight }) => {
  const styleAnim = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      width: '100%',
      transform: [{ translateY: -translationY.value }],
      zIndex: 1,
    };
  });
  const { onLayout, ...layout } = useLayout();

  useEffect(() => {
    onHeight(layout.height);
  }, [layout.height, onHeight]);

  return (
    <Animated.View style={styleAnim} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
};

const MIN_SCROLL_THRESHOLD = 5;

export default React.forwardRef(StickyList);
