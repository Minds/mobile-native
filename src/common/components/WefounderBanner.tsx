import Banner from './Banner';
import Link from './Link';
import analyticsService from '../services/analytics.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Trans } from 'react-i18next';
import i18n from '../services/i18n.service';
import { useIsFeatureOn } from 'ExperimentsProvider';
import { Linking } from 'react-native';

export default function WefounderBanner() {
  const featureOn = useIsFeatureOn('mob-4903-wefounder-banner');

  if (!featureOn) {
    return null;
  }
  const onPress = () => {
    analyticsService.trackClick('banner:wefounder:action');
    Linking.openURL('https://wefunder.com/minds/');
  };

  return (
    <Banner
      dismissIdentifier="banner:wefounder"
      onPress={onPress}
      text={
        <Trans
          i18nKey="link"
          defaults={i18n.t('banners.wefounder.title')}
          components={{
            link: <WefounderLink />,
          }}
        />
      }
    />
  );
}

const WefounderLink = () => (
  <Link style={ThemedStyles.style.fontMedium}>
    {i18n.t('banners.wefounder.refer')}
  </Link>
);
