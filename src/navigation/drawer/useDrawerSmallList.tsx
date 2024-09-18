import { useNavigation } from '@react-navigation/native';
import { IS_TENANT, TENANT } from '~/config/Config';
import { navigateToHelp } from '~/settings/SettingsScreen';
import sp from '~/services/serviceProvider';

export const useDrawerSmallList = () => {
  const navigation = useNavigation<any>();
  const i18n = sp.i18n;
  return !IS_TENANT
    ? [
        {
          name: i18n.t('earnScreen.title', { TENANT }),
          onPress: () => {
            navigation.navigate('EarnModal');
          },
        },
        {
          name: i18n.t('analytics.title'),
          onPress: () => {
            navigation.navigate('Analytics');
          },
        },
        {
          name: i18n.t('help'),
          onPress: navigateToHelp,
        },
      ]
    : null;
};
