import { useDimensions } from '@react-native-community/hooks';
import { debounce } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MText from '~/common/components/MText';
import ThemedStyles, { useMemoStyle } from '~/styles/ThemedStyles';
import ImagePreview from '../ImagePreview';
import FILTERS from './filters';

// to delay the rendering of a component for performance reasons
const Delayed = ({ delay, children }) => {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    setTimeout(() => setHidden(false), delay);
  }, [delay]);
  return hidden ? null : children;
};

const createImg = (source: any, imageStyle) => (
  <Image
    style={imageStyle}
    resizeMode="cover"
    source={{ ...source, uri: source.uri + '?' + source.key }}
  />
);

const createVw = width => (
  <View
    style={{
      height: '100%',
      width,
      overflow: 'hidden',
    }}
  />
);

export default function ImageFilter({
  image,
  onImageChange: _onImageChange,
  extractEnabled,
  onExtractImage,
  onFilterChange,
}) {
  const timeout = useRef<any>();
  const offset = useSharedValue(0);
  const { width, height } = useDimensions().window;
  const filtersContainer = useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width,
    }),
    [width],
  );
  // the number of filters to load, probably should be depreacted.
  // introduced to lazy load the filters for performance sake
  const [filtersToLoad] = useState<any>(5);
  // the current filter index
  const [activeIndex, setActiveIndex] = useState(0);
  // the title of the filter, shown in the center of the screen when filter changes
  const [showingTitle, _setShowingTitle] = useState('');
  const setShowingTitle = useCallback(
    debounce(title => _setShowingTitle(title), 100),
    [],
  );

  useEffect(() => {
    if (activeIndex === 0) {
      return;
    }

    onFilterChange(FILTERS[activeIndex]);
  }, [activeIndex, onFilterChange]);

  const style0 = useAnimatedStyle(() => ({
    right: Math.max(offset.value - width * (filtersToLoad - 1), 0),
  }));
  const style1 = useAnimatedStyle(() => ({
    right: Math.max(offset.value - width * (filtersToLoad - 2), 0),
  }));
  const style2 = useAnimatedStyle(() => ({
    right: Math.max(offset.value - width * (filtersToLoad - 3), 0),
  }));
  const style3 = useAnimatedStyle(() => ({
    right: Math.max(offset.value - width * (filtersToLoad - 4), 0),
  }));
  const style4 = useAnimatedStyle(() => ({
    right: Math.max(offset.value - width * (filtersToLoad - 5), 0),
  }));
  const imageStyle = useMemoStyle(
    [
      {
        height: height - 50,
        width,
        position: 'absolute',
        top: 0,
        left: 0,
      },
    ],
    [height, width],
  );

  const _onExtractImage = useCallback(
    ({ nativeEvent }) => {
      onExtractImage({
        ...image,
        uri: nativeEvent.uri,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [image],
  );

  const Filters = useMemo(() => {
    return FILTERS.slice(0, filtersToLoad).map(
      ({ filterComponent: FilterComponent }, index) => {
        return (
          <FilterComponent
            onExtractImage={_onExtractImage}
            extractImageEnabled={activeIndex === index && extractEnabled} // one on each side
            image={createImg(image, imageStyle)}
          />
        );
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_onExtractImage, activeIndex, extractEnabled, image, filtersToLoad]);

  const filters = (
    <View style={filtersContainer}>
      {[
        <Animated.View style={[styles.filterWrapper, style0]}>
          <Delayed delay={4}>{Filters[4]}</Delayed>
        </Animated.View>,
        <Animated.View style={[styles.filterWrapper, style1]}>
          <Delayed delay={3}>{Filters[3]}</Delayed>
        </Animated.View>,
        <Animated.View style={[styles.filterWrapper, style2]}>
          <Delayed delay={2}>{Filters[2]}</Delayed>
        </Animated.View>,
        <Animated.View style={[styles.filterWrapper, style3]}>
          <Delayed delay={1}>{Filters[1]}</Delayed>
        </Animated.View>,
        <Animated.View style={[styles.filterWrapper, style4]}>
          <ImagePreview fullscreen style={imageStyle} image={image} />
        </Animated.View>,
      ].slice(0, filtersToLoad)}
    </View>
  );

  const onScroll = useCallback(event => {
    cancelAnimation(offset);
    offset.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setShowingTitle(FILTERS[index].title);

    timeout.current = setTimeout(() => {
      setShowingTitle('');
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={ThemedStyles.style.flexContainer}>
      {filters}

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}>
        {useMemo(
          () => new Array(filtersToLoad).fill(null).map(() => createVw(width)),
          [width, filtersToLoad],
        )}
      </ScrollView>

      {Boolean(showingTitle) && (
        <View style={styles.filterContainer}>
          <MText style={styles.filterTitle}>{showingTitle}</MText>
        </View>
      )}
    </View>
  );
}

const styles = ThemedStyles.create({
  filterWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    right: 0,
  },
  filterContainer: ['centered', 'absoluteFill'],
  filterTitle: ['textCenter', 'colorWhite', 'fontXL'],
});
