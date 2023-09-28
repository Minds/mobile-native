import React, { useCallback, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react';
import {
  Dimensions,
  Image as RNImage,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MText from '~/common/components/MText';
import { DEV_MODE, STRAPI_URI } from '~/config/Config';
import { HiddenTap } from '~/settings/screens/DevToolsScreen';
import { Button, ButtonPropsType, H3 } from '~ui';
import i18n from '../common/services/i18n.service';
import { AuthStackParamList } from '../navigation/NavigationTypes';
import ThemedStyles from '../styles/ThemedStyles';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SpacingType } from '~/common/ui/helpers';
import { UISpacingPropType } from '~/styles/Tokens';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from '~/newsfeed/boost-rotator/components/pagination/Pagination';
import {
  ComponentOnboardingV5OnboardingStep,
  GetOnboardingV5VersionsQuery,
  useGetOnboardingV5VersionsQuery,
} from '~/graphql/strapi';

type PropsType = {
  navigation: any;
  route: WelcomeScreenRouteProp;
};

export type WelcomeScreenRouteProp = RouteProp<AuthStackParamList, 'Welcome'>;

const { width } = Dimensions.get('screen');

function WelcomeScreen(props: PropsType) {
  const theme = ThemedStyles.style;

  const { data, isLoading } = useGetOnboardingV5VersionsQuery();
  const carouselData = carouselExtractor(data);
  console.log('WelcomeScreen', JSON.stringify(carouselData), isLoading);

  const onLoginPress = useCallback(() => {
    props.navigation.navigate('MultiUserLogin');
  }, [props.navigation]);

  const onRegisterPress = useCallback(() => {
    props.navigation.navigate('MultiUserRegister');
  }, [props.navigation]);

  const openDevtools = useCallback(
    () => props.navigation.navigate('DevTools'),
    [props.navigation],
  );

  return (
    <SafeAreaView style={theme.flexContainer}>
      <View style={theme.flexContainer}>
        <RNImage
          resizeMode="contain"
          source={require('./../assets/logos/bulb.png')}
          style={styles.image}
        />
        <OnboardingCarousel data={carouselData} />
        <View style={styles.buttonContainer}>
          <Button
            type="action"
            {...buttonProps}
            testID="joinNowButton"
            onPress={onRegisterPress}>
            {i18n.t('auth.createChannel')}
          </Button>
          <Button darkContent {...buttonProps} onPress={onLoginPress}>
            {i18n.t('auth.login')}
          </Button>
        </View>
      </View>

      {DEV_MODE.isActive && (
        <MText style={devtoolsStyle} onPress={openDevtools}>
          Dev Options
        </MText>
      )}
      <HiddenTap style={devToggleStyle}>
        <View />
      </HiddenTap>
    </SafeAreaView>
  );
}

const carouselExtractor = (data?: GetOnboardingV5VersionsQuery) => {
  const screens = [
    ...new Map(
      data?.onboardingV5Versions?.data?.[0]?.attributes?.steps
        ?.map(step => (step as ComponentOnboardingV5OnboardingStep)?.carousel)
        .flat()
        .map(item => [item?.title, { ...item?.media, title: item?.title }]),
    ).values(),
  ];
  return screens;
};

type OnboardingCarouselProps = {
  data?: any[];
};
const OnboardingCarousel = ({ data }: OnboardingCarouselProps) => {
  const [index, setIndex] = useState(0);

  const renderItem = useCallback(({ item, index }) => {
    const { url } = item?.data?.attributes ?? {};
    const imageSize = { height: 338, width: 156 };
    const image = url ? { uri: `${STRAPI_URI}${url}` } : item.image;
    return (
      <View
        key={`${index}`}
        style={{ alignItems: 'center', paddingHorizontal: 60 }}>
        <H3 align="center" bottom="XXXL2">
          {item.title}
        </H3>
        <Image source={image} style={imageSize} />
      </View>
    );
  }, []);

  return (
    <>
      <Carousel
        autoPlay
        autoPlayInterval={1500}
        pagingEnabled
        onSnapToItem={setIndex}
        width={width}
        height={475}
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

const defaultData = [
  {
    title: 'Own your identity, content and social graph',
    image: require('./../assets/images/onboarding1.png'),
  },
  {
    title: 'Connect with creative minds and communities globally',
    image: require('./../assets/images/onboarding2.png'),
  },
  {
    title: 'The best place to grow your audience',
    image: require('./../assets/images/onboarding3.png'),
  },
  {
    title: 'Earn real revenue as a creator or an affiliate',
    image: require('./../assets/images/onboarding4.png'),
  },
];

const devtoolsStyle = ThemedStyles.combine(
  'positionAbsoluteTopRight',
  'marginTop9x',
  'padding5x',
);

const devToggleStyle = ThemedStyles.combine(
  'positionAbsoluteTopLeft',
  'width30',
  'marginTop9x',
  'padding5x',
);

export default withErrorBoundaryScreen(
  observer(WelcomeScreen),
  'WelcomeScreen',
);

const styles = StyleSheet.create({
  image: {
    height: 36,
    width: 30,
    marginVertical: 30,
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
  },
});

type ButtonType = Partial<
  ButtonPropsType & {
    containerStyle?: ViewStyle | undefined;
    spacingType?: SpacingType | undefined;
    children?: React.ReactNode;
  } & UISpacingPropType
>;
const buttonProps: ButtonType = {
  font: 'medium',
  bottom: 'XL',
};
