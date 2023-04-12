import NavigationService from '~/navigation/NavigationService';
import Banner from './Banner';
import Link from './Link';
import analyticsService from '../services/analytics.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Trans } from 'react-i18next';
import i18n from '../services/i18n.service';

export default function ReferBanner() {
  const onPress = () => {
    analyticsService.trackClick('banner:refer:action');
    NavigationService.push('Referrals');
  };

  return (
    <Banner
      name="banner:refer"
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
