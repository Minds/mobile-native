import { useLayout } from '@react-native-community/hooks';
import React, { useContext, useEffect, useState } from 'react';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type BaseModel from '../BaseModel';
import FeedList, { FeedListPropsType } from './FeedList';

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

/**
 * Context
 */
export const Context = React.createContext<
  | {
      translationY: SharedValue<number>;
      scrollY: SharedValue<number>;
      scrollDirection: SharedValue<number>;
      headerHeight: number;
    }
  | undefined
>(undefined);

/**
 * Use Feed List Context hook
 */
export const useFeedListContext = () => {
  return useContext(Context);
};

/**
 * Feed list with reanimated sticky header
 */
function FeedListSticky<T extends BaseModel>(
  props: FeedListPropsType<T>,
  ref: any,
) {
  const translationY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const scrollDirection = useSharedValue(0);
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
      if (Math.abs(event.contentOffset.y - scrollY.value) > 5) {
        scrollDirection.value = event.contentOffset.y > scrollY.value ? 2 : 1;
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

  const contentStyle = React.useMemo(() => ({ paddingTop: headerHeight }), [
    headerHeight,
  ]);

  return (
    <Context.Provider
      value={{ translationY, scrollY, headerHeight, scrollDirection }}>
      <FeedList
        ref={ref}
        {...otherProps}
        onScroll={scrollHandler}
        contentContainerStyle={contentStyle}
        bottomComponent={
          <>
            <Header translationY={translationY} onHeight={setHeaderHeight}>
              {header}
            </Header>
            {props.bottomComponent}
          </>
        }
      />
    </Context.Provider>
  );
}

export default React.forwardRef(FeedListSticky);
