import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';
import MenuItem from '../../../common/components/menus/MenuItem';
import { useNavigation } from '@react-navigation/native';
import LabeledComponent from '../../../common/components/LabeledComponent';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { useIsFeatureOn } from 'ExperimentsProvider';

type MappingItems = {
  title: string;
  screen: string;
  params: any;
};

/**
 * Verify Email Modal Screen
 */
export default withErrorBoundaryScreen(
  observer(function VerifyUniquenessScreen() {
    const theme = ThemedStyles.style;
    const navigation = useNavigation();
    const IOS_IAP_ENABLED = useIsFeatureOn('mob-4990-iap-subscription-ios');

    const mappingCallback = ({ title, screen, params }: MappingItems) => ({
      title,
      onPress: () => navigation.navigate(screen as any, params),
    });

    const stepsMapping: Array<MappingItems> = [
      {
        title: i18n.t('onboarding.phoneNumber'),
        screen: 'PhoneValidation',
        params: {
          onConfirm: () => {
            inFeedNoticesService.load();
            navigation.goBack();
          },
          onCancel: () => false,
        },
      },
      /*{
      title: i18n.t('onboarding.connectWallet'),
      screen: 'PhoneValidation',
      params: {},
    },
    {
      title: i18n.t('onboarding.connectBank'),
      screen: 'PhoneValidation',
      params: {},
    },*/
    ];

    const otherMapping: Array<MappingItems> = [
      {
        title: i18n.t('monetize.plusHeader'),
        screen: 'UpgradeScreen',
        params: { onComplete: () => inFeedNoticesService.load(), pro: false },
      },
      {
        title: i18n.t('monetize.proHeader'),
        screen: 'UpgradeScreen',
        params: { onComplete: () => inFeedNoticesService.load(), pro: true },
      },
    ];

    const steps = stepsMapping.map(mappingCallback);
    const other = otherMapping.map(mappingCallback);

    return (
      <ModalContainer
        title={i18n.t('onboarding.verifyUniqueness')}
        onPressBack={navigation.goBack}>
        <View style={theme.flexContainer}>
          {steps.map(item => (
            <MenuItem key={item.title} {...item} />
          ))}

          {IOS_IAP_ENABLED && (
            <LabeledComponent
              label={'OTHER'}
              labelStyle={[theme.marginTop5x, theme.marginLeft5x]}>
              {other.map(item => (
                <MenuItem key={item.title} {...item} />
              ))}
            </LabeledComponent>
          )}
        </View>
      </ModalContainer>
    );
  }),
  'VerifyUniquenessScreen',
);
