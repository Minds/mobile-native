import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';
import MenuItem from '../../../common/components/menus/MenuItem';
import { useNavigation } from '@react-navigation/native';
import LabeledComponent from '../../../common/components/LabeledComponent';

type MappingItems = {
  title: string;
  screen: string;
  params: any;
};

/**
 * Verify Email Modal Screen
 */
export default observer(function VerifyUniquenessScreen() {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();

  const mappingCallback = ({ title, screen, params }: MappingItems) => ({
    title,
    onPress: () => navigation.navigate(screen, params),
  });

  const stepsMapping: Array<MappingItems> = [
    {
      title: i18n.t('onboarding.phoneNumber'),
      screen: 'PhoneValidation',
      params: {},
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
      params: { onComplete: () => {}, pro: false },
    },
    {
      title: i18n.t('monetize.proHeader'),
      screen: 'UpgradeScreen',
      params: { onComplete: () => {}, pro: true },
    },
    /*{
      title: i18n.t('onboarding.buyTokens'),
      screen: '',
      params: {},
    },*/
  ];

  const steps = stepsMapping.map(mappingCallback);

  const other = otherMapping.map(mappingCallback);

  return (
    <ModalContainer
      title={i18n.t('onboarding.verifyUniqueness')}
      onPressBack={navigation.goBack}>
      <View style={theme.flexContainer}>
        {steps.map((item) => (
          <MenuItem item={item} />
        ))}

        <LabeledComponent
          label={'OTHER'}
          labelStyle={[theme.marginTop5x, theme.marginLeft5x]}>
          {other.map((item) => (
            <MenuItem item={item} />
          ))}
        </LabeledComponent>
      </View>
    </ModalContainer>
  );
});
