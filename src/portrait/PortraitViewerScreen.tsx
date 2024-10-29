import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { useStores } from '~/common/hooks/use-stores';
import { AppStackParamList } from '~/navigation/NavigationTypes';
import withModalProvider from '~/navigation/withModalProvide';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

import UserContentSwiper from './components/UserContentSwiper';
import usePortraitAnimation from './hooks/usePortraitAnimation';
import sp from '~/services/serviceProvider';

type ActivityFullScreenRouteProp = RouteProp<
  AppStackParamList,
  'PortraitViewerScreen'
>;
type ActivityFullScreenNavProp = NavigationProp<
  AppStackParamList,
  'PortraitViewerScreen'
>;

type PropsType = {
  route: ActivityFullScreenRouteProp;
  navigation: ActivityFullScreenNavProp;
};

/**
 * Portrait content swiper
 */
const PortraitViewerScreen = withErrorBoundaryScreen(
  observer((props: PropsType) => {
    // global portrait store
    const portraitStore = useStores().portrait;
    const ref = React.useRef<ICarouselInstance>(null);

    let index = 0;
    const { guid } = props.route.params ?? {};

    // set default index based on guid
    if (guid) {
      const foundItemIndex = portraitStore.items.findIndex(
        p => p.user.guid === guid,
      );

      if (foundItemIndex >= 0) {
        index = foundItemIndex;
      }
    }

    const store = useLocalStore(() => ({
      index,
      unseenMode: portraitStore.items[index].unseen,
      items: portraitStore.items,
      setIndex(v) {
        store.index = v;
        if (!store.items[store.index].unseen) {
          this.unseenMode = false;
        }
      },
      preloadImages() {
        if (!store.items[store.index].imagesPreloaded) {
          store.items[store.index].preloadImages();
        }
        if (store.index > 0) {
          const item = store.items[store.index - 1];
          if (!item.imagesPreloaded) {
            item.preloadImages();
          }
        }
        if (store.index < store.items.length - 1) {
          const item = store.items[store.index + 1];
          if (!item.imagesPreloaded) {
            item.preloadImages();
          }
        }
      },
      prevIndex() {
        if (store.index > 0) {
          store.index = store.index - 1;
          store.preloadImages();
          ref.current?.scrollTo({ index: store.index, animated: true });
        }
      },
      nextIndex() {
        if (store.unseenMode) {
          const nextUnseen = store.items
            .slice(store.index + 1)
            .findIndex(user => user.unseen);

          if (nextUnseen !== -1) {
            store.index = store.index + nextUnseen + 1;
            store.preloadImages();
            ref.current?.scrollTo({ index: store.index, animated: true });
          } else {
            const prevUnseen = store.items
              .slice(0, store.index)
              .findIndex(user => user.unseen);
            if (prevUnseen !== -1) {
              store.index = prevUnseen;
              store.preloadImages();
              ref.current?.scrollTo({ index: store.index, animated: true });
            } else {
              props.navigation.goBack();
            }
          }
        } else {
          if (store.index < store.items.length - 1) {
            store.index = store.index + 1;
            store.preloadImages();
            ref.current?.scrollTo({ index: store.index, animated: true });
          } else {
            props.navigation.goBack();
          }
        }
      },
    }));

    useFocusEffect(
      useCallback(() => {
        // resort data when unfocused
        return () => {
          portraitStore.sort();
          sp.resolve('portraitContent').save();
        };
      }, [portraitStore]),
    );

    const { width, height } = useSafeAreaFrame();

    const animationStyle = usePortraitAnimation(height, width);

    const renderItem = useCallback(
      itemProps => <CustomItem {...itemProps} store={store} />,
      [store],
    );

    return (
      <View style={sp.styles.style.flexContainer}>
        <Carousel
          loop={false}
          ref={ref}
          vertical={false}
          windowSize={3}
          defaultIndex={index}
          pagingEnabled={true}
          onSnapToItem={store.setIndex}
          width={width}
          height={height}
          data={store.items}
          renderItem={renderItem}
          customAnimation={animationStyle}
          scrollAnimationDuration={350}
        />
      </View>
    );
  }),
  'PortraitViewerScreen',
);

/**
 * Focus provider context
 */
const FocusProvider = React.createContext(false);

/**
 * use focus hook
 */
export const useCarouselFocus = () => React.useContext(FocusProvider);

/**
 * use focus effect hook
 */
export const useCarouselFocusEffect = (effect: Function) => {
  const focused = useCarouselFocus();
  React.useEffect(() => {
    if (focused) {
      effect();
    }
  }, [effect, focused]);
};

type ItemProps = {
  index: number;
  animationValue: SharedValue<number>;
  item: any;
  store: any;
};
const CustomItem: React.FC<ItemProps> = observer(
  ({ index, animationValue, item, store }) => {
    const maskStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        animationValue.value,
        [-1, 0, 1],
        ['#000000dd', 'transparent', '#000000dd'],
      );

      return {
        backgroundColor,
      };
    }, [animationValue]);

    return (
      <View style={sp.styles.style.flexContainer}>
        <FocusProvider.Provider value={index === store.index}>
          <UserContentSwiper
            key={index}
            item={item}
            nextUser={store.nextIndex}
            prevUser={store.prevIndex}
            unseenMode={store.unseenMode}
          />
        </FocusProvider.Provider>
        <Animated.View
          pointerEvents="none"
          style={[sp.styles.style.absoluteFill, maskStyle]}
        />
      </View>
    );
  },
);

export default PortraitViewerScreen;

export const withModal = withModalProvider(PortraitViewerScreen);
