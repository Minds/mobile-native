import { useState } from 'react';
import { Image as RNImage, Dimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { H3 } from '~/common/ui';
import { IS_IPAD, STRAPI_URI } from '~/config/Config';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from '~/newsfeed/boost-rotator/components/pagination/Pagination';
import ThemedStyles from '~/styles/ThemedStyles';
import { useCarouselData } from '../hooks';
import { Maybe, UploadFileEntity } from '~/graphql/strapi';

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
        source={require('assets/logos/bulb.png')}
        style={styles.image}
      />
      <Carousel
        autoPlay
        autoPlayInterval={2500}
        pagingEnabled
        onSnapToItem={setIndex}
        width={width}
        height={IS_IPAD ? 820 : 475}
        data={data?.length ? data : defaultData}
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
    height: IS_IPAD ? 690 : 338,
    width: IS_IPAD ? 318 : 156,
    borderWidth: 2,
    borderRadius: IS_IPAD ? 35 : 10,
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
    title: 'Own your identity, content and social graph',
    image: require('assets/images/onboarding1.png'),
  },
  {
    title: 'Connect with creative minds and communities globally',
    image: require('assets/images/onboarding2.png'),
  },
  {
    title: 'The best place to grow your audience',
    image: require('assets/images/onboarding3.png'),
  },
  {
    title: 'Earn real revenue as a creator or an affiliate',
    image: require('assets/images/onboarding4.png'),
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
