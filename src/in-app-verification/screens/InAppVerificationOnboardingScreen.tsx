import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import FitScrollView from '../../common/components/FitScrollView';
import MenuItemOption from '../../common/components/menus/MenuItemOption';
import MText from '../../common/components/MText';
import SaveButton from '../../common/components/SaveButton';
import i18n from '../../common/services/i18n.service';
import openUrlService from '../../common/services/open-url.service';
import { B1, Column, H3, Screen, ScreenHeader } from '../../common/ui';
import ThemedStyles from '../../styles/ThemedStyles';
import { InAppVerificationStackNavigationProp } from '../InAppVerificationStack';

type NavigationProp = InAppVerificationStackNavigationProp<'InAppVerificationOnboarding'>;

export default function InAppVerificationOnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const onContinue = () => {
    navigation.navigate('InAppVerificationCodeRequest', {});
  };

  return (
    <Screen safe>
      <ScreenHeader
        title="Verify Account"
        centerTitle
        border
        back
        extra={
          <SaveButton
            disabled={!termsAgreed}
            onPress={onContinue}
            text={i18n.t('continue')}
          />
        }
      />
      <FitScrollView>
        <Column space="L" top="XXL">
          <H3 bottom="M">{i18n.t('inAppVerification.onboarding.title')}</H3>
          <B1 color="secondary" bottom="XL2">
            {i18n.t('inAppVerification.onboarding.description')}
          </B1>
          <H3>{i18n.t('inAppVerification.onboarding.step1.title')}</H3>
          <B1 color="secondary" bottom="XL">
            {i18n.t('inAppVerification.onboarding.step1.description')}
          </B1>
          <H3>{i18n.t('inAppVerification.onboarding.step2.title')}</H3>
          <B1 color="secondary" bottom="XL">
            {i18n.t('inAppVerification.onboarding.step2.description')}
          </B1>
          <H3>{i18n.t('inAppVerification.onboarding.step3.title')}</H3>
          <B1 color="secondary">
            {i18n.t('inAppVerification.onboarding.step3.description')}
          </B1>
        </Column>
        <MenuItemOption
          onPress={() => setTermsAgreed(val => !val)}
          title={
            <B1>
              I agree to the{' '}
              <MText
                onPress={() =>
                  openUrlService.open(
                    'https://www.minds.com/p/monetization-terms',
                  )
                }
                style={{
                  textDecorationLine: 'underline',
                  color: ThemedStyles.style.colorLink.color,
                }}>
                Terms
              </MText>
            </B1>
          }
          selected={termsAgreed}
          mode="checkbox"
          borderless
        />
      </FitScrollView>
    </Screen>
  );
}
