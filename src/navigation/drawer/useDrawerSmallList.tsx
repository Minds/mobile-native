import { useNavigation } from '@react-navigation/native';
import i18n from '~/common/services/i18n.service';
import { IS_TENANT } from '~/config/Config';
import { navigateToHelp } from '~/settings/SettingsScreen';

export const useDrawerSmallList = () => {
  const navigation = useNavigation<any>();
  return !IS_TENANT
    ? [
        {
          name: i18n.t('earnScreen.title'),
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
