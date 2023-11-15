import { useState } from 'react';
import { Image as RNImage, Dimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { H3 } from '~/common/ui';
import { STRAPI_URI } from '~/config/Config';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from '~/newsfeed/boost-rotator/components/pagination/Pagination';
import ThemedStyles from '~/styles/ThemedStyles';
import { useCarouselData } from '../hooks';
import { Maybe, UploadFileEntity } from '~/graphql/strapi';
import assets from '@assets';
const { width } = Dimensions.get('screen');

type OnboardingCarouselProps = {
  data: {
    title: string | undefined;
    data?: Maybe<UploadFileEntity>;
  }[];
};

export const CarouselComponent = ({ data }: OnboardingCarouselProps) => {
  const [index, setIndex] = useState(0);

  return (
    <>
      <RNImage
        resizeMode="contain"
        source={assets.LOGO_SQUARED}
        style={styles.image}
      />
      <Carousel
        autoPlay
        autoPlayInterval={2500}
        pagingEnabled
        onSnapToItem={setIndex}
        width={width}
        height={475}
        data={defaultData}
        renderItem={renderItem}
        style={ThemedStyles.style.marginBottom1x}
      />
      <Pagination
        activeDotIndex={index}
        dotsLength={data?.length ?? 0}
        dotColor={ThemedStyles.getColor('PrimaryText')}
        inactiveDotColor={ThemedStyles.getColor('SecondaryText')}
      />
    </>
  );
};

const renderItem = ({ item, index }) => {
  const { url } = item?.data?.attributes ?? {};
  const imageSize = {
    height: 338,
    width: 156,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#565658',
  };
  const image = url ? { uri: `${STRAPI_URI}${url}` } : item.image;
  return (
    <View
      key={`${index}`}
      style={[ThemedStyles.style.alignCenter, { paddingHorizontal: 60 }]}>
      <H3 align="center" bottom="XXXL2">
        {item.title}
      </H3>
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
    title: 'Demo day baby!',
    image: require('~/assets/images/onboarding1.png'),
  },
  {
    title: 'Join now if you want to live',
    image: require('~/assets/images/onboarding2.png'),
  },
];

const styles = ThemedStyles.create({
  image: {
    height: 36,
    width: 30,
    marginVertical: 30,
    alignSelf: 'center',
  },
});
