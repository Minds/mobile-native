import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, Image, View, FlatList } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import MText from '~/common/components/MText';
import PressableScale from '~/common/components/PressableScale';
import { IS_IOS } from '~/config/Config';
import FILTERS, { PhotoFilter } from './filters';
import sp from '~/services/serviceProvider';

const { width, height } = Dimensions.get('window');
const GALLERY_ITEM_WIDTH = 90;
const GALLERY_MARGIN = 5;
const ITEM_WIDTH = GALLERY_MARGIN * 2 + GALLERY_ITEM_WIDTH;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// ---- Types ------------------------------------------------------------------

type ItemThumbPropsType = {
  item: PhotoFilter;
  active: boolean;
  onTap: () => void;
  image: any;
};

type ThumbFilterPropsType = {
  item: PhotoFilter;
  image: any;
};

type ItemPropsType = {
  item: PhotoFilter;
  index: number;
  position;
  image: any;
  activeIndex: number;
  onExtractImage: ({ nativeEvent }: any) => void;
  extractEnabled: boolean;
};

type PropsType = {
  image: any;
  extractEnabled: boolean;
  onExtractImage: (any) => void;
  onFilterChange: (filter: string | null) => void;
};

// ---- Methods -------------------------------------------------------------

const getItemLayout = (data, index) => ({
  length: width,
  offset: width * index - (IS_IOS ? 0 : 0.1),
  index,
});

const getGalleryItemLayout = (data, index) => ({
  length: ITEM_WIDTH,
  offset: ITEM_WIDTH * index,
  index,
});

// ---- Components -------------------------------------------------------------

const ItemThumb = ({ item, active, onTap, image }: ItemThumbPropsType) => {
  return (
    <PressableScale onPress={onTap}>
      <View style={active ? styles.activeThumb : styles.thumb}>
        <ThumbFilter item={item} image={image} />
      </View>
    </PressableScale>
  );
};

const ThumbFilter = React.memo(({ image, item }: ThumbFilterPropsType) => {
  return item.filterComponent ? (
    <item.filterComponent
      image={
        <Image
          source={{
            uri: image.uri + `?thumb${image.key}}`,
          }}
          style={styles.thumbImage}
          resizeMode="cover"
        />
      }
    />
  ) : (
    <Image
      source={{
        uri: image.uri + `?thumb${image.key}}`,
      }}
      style={styles.thumbImage}
      resizeMode="cover"
    />
  );
});

const Item = React.memo(
  ({
    item,
    index,
    position,
    image,
    activeIndex,
    onExtractImage,
    extractEnabled,
  }: ItemPropsType) => {
    const style = useAnimatedStyle(() => {
      const translateX = interpolate(
        position.value,
        [(index - 1) * width, index * width, (index + 1) * width],
        [-width, 0, width],
        Extrapolate.CLAMP,
      );
      return {
        width,
        height,
        transform: [{ translateX }],
      };
    });

    const FilterComponent = item.filterComponent;
    return (
      <View style={styles.itemContainer}>
        <Animated.View style={style}>
          {FilterComponent ? (
            <FilterComponent
              fadeDuration={0}
              onExtractImage={onExtractImage}
              extractImageEnabled={activeIndex === index && extractEnabled} // one on each side
              image={
                <Image
                  fadeDuration={0}
                  source={{
                    uri: image.uri + `?${image.key}`,
                  }}
                  style={styles.mainImage}
                  resizeMode={image.width > image.height ? 'contain' : 'cover'}
                />
              }
            />
          ) : (
            <Image
              fadeDuration={0}
              source={{
                uri: image.uri + `?${image.key}`,
              }}
              style={styles.mainImage}
              resizeMode={image.width > image.height ? 'contain' : 'cover'}
            />
          )}
          <MotiView
            from={{ opacity: 1 }}
            animate={{
              opacity: activeIndex === index ? 0 : 1,
            }}
            delay={1500}
            style={styles.filterContainer}>
            <MText style={styles.filterTitle}>{item.title}</MText>
          </MotiView>
        </Animated.View>
      </View>
    );
  },
);

/**
 * ImageFilterSlider component
 */
export default function ImageFilterSlider({
  image,
  extractEnabled,
  onExtractImage,
  onFilterChange,
}: PropsType) {
  const position = useSharedValue(0);

  const swiperRef = React.useRef<any>(null);
  const galleryRef = React.useRef<any>(null);
  const [activeIndex, setIndex] = React.useState(0);

  const scrollHandler = useAnimatedScrollHandler(e => {
    position.value = e.contentOffset.x;
  });

  const _onExtractImage = React.useCallback(
    ({ nativeEvent }) => {
      const uri = IS_IOS ? `file://${nativeEvent.uri}` : nativeEvent.uri;
      onExtractImage({
        ...image,
        uri,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [image],
  );

  const changeIndex = React.useCallback(
    index => {
      if (index * ITEM_WIDTH + ITEM_WIDTH * 0.5 > width / 2) {
        const offset = index * ITEM_WIDTH + ITEM_WIDTH * 0.5 - width / 2;
        galleryRef.current?.scrollToOffset({
          offset,
          animated: true,
        });
      } else {
        galleryRef.current?.scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
      index > 0 ? onFilterChange(FILTERS[index].title) : onFilterChange(null);
      setIndex(index);
    },
    [onFilterChange],
  );

  const mainScrollEnd = React.useCallback(
    e => {
      const current = Math.round(e.nativeEvent.contentOffset.x / width);
      changeIndex(current);
    },
    [changeIndex],
  );

  const onTapGallery = index => {
    const animated = IS_IOS ? true : false;
    changeIndex(index);
    swiperRef.current?.scrollToIndex({ index, animated });
  };

  const renderMainItem = React.useCallback(
    ({ item, index }) => (
      <Item
        item={item}
        position={position}
        index={index}
        image={image}
        activeIndex={activeIndex}
        extractEnabled={extractEnabled}
        onExtractImage={_onExtractImage}
      />
    ),
    [_onExtractImage, activeIndex, extractEnabled, image, position],
  );

  return (
    <View style={sp.styles.style.flexContainer}>
      {!IS_IOS && ( // on Android we show a placeholder because the filtered image sometimes takes a while to load
        <Image
          source={{
            uri: image.uri + `?t${image.key}`,
          }}
          style={styles.placeholder}
          resizeMode={image.width > image.height ? 'contain' : 'cover'}
        />
      )}
      <AnimatedFlatList
        horizontal
        ref={swiperRef}
        pagingEnabled
        bounces={false}
        windowSize={3}
        onMomentumScrollEnd={mainScrollEnd}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={6}
        getItemLayout={getItemLayout}
        scrollEventThrottle={0.1}
        onScroll={scrollHandler}
        data={FILTERS}
        renderItem={renderMainItem}
      />
      <FlatList
        style={styles.gallery}
        ref={galleryRef}
        removeClippedSubviews={false}
        horizontal
        windowSize={6}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={6}
        data={FILTERS}
        getItemLayout={getGalleryItemLayout}
        renderItem={({ item, index }) => (
          <ItemThumb
            item={item}
            active={index === activeIndex}
            onTap={() => onTapGallery(index)}
            image={image}
          />
        )}
      />
    </View>
  );
}

const styles = sp.styles.create({
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width - (IS_IOS ? 0 : 0.1),
    height: height - 65,
  },
  itemContainer: {
    width: width - (IS_IOS ? 0 : 0.1), //workaround for android
    height,
    overflow: 'hidden',
  },
  activeThumb: {
    borderRadius: 8,
    width: GALLERY_ITEM_WIDTH,
    height: GALLERY_ITEM_WIDTH,
    margin: GALLERY_MARGIN,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
  },
  gallery: {
    position: 'absolute',
    bottom: 50,
  },
  mainImage: {
    width,
    height: height - 65,
  },
  thumbImage: {
    width: GALLERY_ITEM_WIDTH,
    height: GALLERY_ITEM_WIDTH,
  },
  thumb: {
    borderRadius: 8,
    width: GALLERY_ITEM_WIDTH,
    height: GALLERY_ITEM_WIDTH,
    margin: GALLERY_MARGIN,
    borderWidth: 0,
    borderColor: 'white',
    overflow: 'hidden',
  },
  filterContainer: ['centered', 'positionAbsolute'],
  filterTitle: [
    'textCenter',
    'colorWhite',
    'fontXXXL',
    {
      marginTop: -height / 2,
      textShadowColor: 'rgba(0,0,0,1)',
      shadowOffset: { width: 2, height: 2 },
      shadowRadius: 0,
      shadowOpacity: 0.7,
    },
  ],
});
