import NavigationService from '~/navigation/NavigationService';
import Banner from './Banner';
import Link from './Link';
import analyticsService from '../services/analytics.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Trans } from 'react-i18next';
import i18n from '../services/i18n.service';
import { useIsFeatureOn } from 'ExperimentsProvider';

export default function ReferBanner() {
  const featureOn = useIsFeatureOn('mob-4903-referrer-banner');

  if (!featureOn) {
    return null;
  }
  const onPress = () => {
    analyticsService.trackClick('banner:refer:action');
    NavigationService.push('Referrals');
  };

  return (
    <Banner
      dismissIdentifier="banner:refer"
      onPress={onPress}
      text={
        <Trans
          i18nKey="refer"
          defaults={i18n.t('banners.refer.title')}
          components={{
            refer: <ReferLink />,
          }}
        />
      }
    />
  );
}

const ReferLink = () => (
  <Link style={ThemedStyles.style.fontMedium}>
    {i18n.t('banners.refer.refer')}
  </Link>
);
