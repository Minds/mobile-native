import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';

import ModalContainer from './ModalContainer';
import MenuItem from '../../../common/components/menus/MenuItem';
import { useNavigation } from '@react-navigation/native';
import LabeledComponent from '../../../common/components/LabeledComponent';
import { PRO_PLUS_SUBSCRIPTION_ENABLED } from '~/config/Config';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

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
    const theme = sp.styles.style;
    const navigation = useNavigation();
    const i18n = sp.i18n;
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
            const inFeedNoticesService = sp.resolve('inFeedNotices');
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
        params: {
          onComplete: () => sp.resolve('inFeedNotices').load(),
          pro: false,
        },
      },
      {
        title: i18n.t('monetize.proHeader'),
        screen: 'UpgradeScreen',
        params: {
          onComplete: () => sp.resolve('inFeedNotices').load(),
          pro: true,
        },
      },
    ];

    const steps = stepsMapping.map(mappingCallback);
    const other = otherMapping.map(mappingCallback);

    return (
      <ModalContainer
        title={i18n.t('onboarding.verifyUniqueness')}
        contentContainer={theme.alignSelfCenterMaxWidth}
        onPressBack={navigation.goBack}>
        <View style={theme.flexContainer}>
          {steps.map(item => (
            <MenuItem key={item.title} {...item} />
          ))}

          {PRO_PLUS_SUBSCRIPTION_ENABLED && (
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
