import { useState } from 'react';
import {
  Image as RNImage,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { H1, H3 } from '~/common/ui';
import { IS_IOS, IS_IPAD, STRAPI_URI } from '~/config/Config';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from '~/newsfeed/boost-rotator/components/pagination/Pagination';
import ThemedStyles from '~/styles/ThemedStyles';
import { useCarouselData } from '../hooks';
import { Maybe, UploadFileEntity } from '~/graphql/strapi';
import assets from '@assets';

type OnboardingCarouselProps = {
  data: {
    title: string | undefined;
    data?: Maybe<UploadFileEntity>;
  }[];
};

export const CarouselComponent = ({ data }: OnboardingCarouselProps) => {
  const [index, setIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const isPortrait = width < height;
  const insets = useSafeAreaInsets();

  const heightCarrousel =
    height - ((IS_IOS ? 300 : 350) + insets.top + insets.bottom);

  return (
    <>
      <RNImage
        resizeMode="contain"
        source={assets.LOGO_SQUARED}
        style={styles.logo}
      />
      <View
        style={{
          height: heightCarrousel,
        }}>
        <Carousel
          autoPlay
          autoPlayInterval={2500}
          pagingEnabled
          onSnapToItem={setIndex}
          height={heightCarrousel}
          width={width}
          data={data?.length ? data : defaultData}
          renderItem={renderItem(isPortrait)}
        />
      </View>
      <Pagination
        activeDotIndex={index}
        dotsLength={data?.length ?? 0}
        dotColor={ThemedStyles.getColor('PrimaryText')}
        inactiveDotColor={ThemedStyles.getColor('SecondaryText')}
      />
    </>
  );
};

const renderItem =
  (isPortrait: boolean) =>
  ({ item, index }) => {
    const { url } = item?.data?.attributes ?? {};
    const imageSize = {
      flex: 1,
      flexGrow: 1,
      aspectRatio: 0.45,
      borderWidth: 2,
      borderRadius: IS_IPAD && isPortrait ? 35 : 17,
      borderColor: '#565658',
    };
    const Text = IS_IPAD ? H1 : H3;

    const image = url ? { uri: `${STRAPI_URI}${url}` } : item.image;
    return (
      <View key={`${index}`} style={styles.item}>
        <Text align="center" bottom="XL2" horizontal="XXL">
          {item.title}
        </Text>
        <Image source={image} style={imageSize} />
      </View>
    );
  };

export const OnboardingCarousel = () => {
  const { data } = useCarouselData();
  return <CarouselComponent data={data} />;
};

const defaultData = [
  {
    title: 'Own your identity, content and social graph',
    image: require('~/assets/images/onboarding1.png'),
  },
  {
    title: 'Connect with creative minds and communities globally',
    image: require('~/assets/images/onboarding2.png'),
  },
  {
    title: 'The best place to grow your audience',
    image: require('~/assets/images/onboarding3.png'),
  },
  {
    title: 'Earn real revenue as a creator or an affiliate',
    image: require('~/assets/images/onboarding4.png'),
  },
];

const styles = StyleSheet.create({
  logo: {
    height: 36,
    width: 30,
    marginVertical: 30,
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
});
