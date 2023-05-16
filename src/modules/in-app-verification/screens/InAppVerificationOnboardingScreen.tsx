import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import FitScrollView from '~/common/components/FitScrollView';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import MText from '~/common/components/MText';
import SaveButton from '~/common/components/SaveButton';
import openUrlService from '~/common/services/open-url.service';
import { B1, Column, H3, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { InAppVerificationStackNavigationProp } from '../InAppVerificationStack';
import { useTranslation } from '../locales';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type NavigationProp =
  InAppVerificationStackNavigationProp<'InAppVerificationOnboarding'>;

function InAppVerificationOnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const { t } = useTranslation();

  const onContinue = () => {
    navigation.navigate('InAppVerificationCodeRequest');
  };

  return (
    <Screen safe>
      <ScreenHeader
        title={t('Verify Account')}
        centerTitle
        border
        back
        extra={
          <SaveButton
            disabled={!termsAgreed}
            onPress={onContinue}
            text={t('Continue')}
          />
        }
      />
      <FitScrollView>
        <Column space="L" top="XXL">
          <H3 bottom="M">{t('A privacy protecting human detector')}</H3>
          <B1 color="secondary" bottom="XL2">
            {t(
              'Most apps require creepy amounts of personal data to verify your location and prevent spam. Not Minds.',
            )}
          </B1>
          <H3>{t('Step 1')}</H3>
          <B1 color="secondary" bottom="XL">
            {t('Write down the code we send you.')}
          </B1>
          <H3>{t('Step 2')}</H3>
          <B1 color="secondary" bottom="XL">
            {t('Take a photo of the code.')}
          </B1>
          <H3>{t('Step 3')}</H3>
          <B1 color="secondary">
            {t("That's it. Now you can earn tokens and other rewards.")}
          </B1>
        </Column>
        <MenuItemOption
          onPress={() => setTermsAgreed(val => !val)}
          title={
            <B1>
              {t('I agree to the ')}
              <MText
                onPress={() =>
                  openUrlService.open(
                    'https://www.minds.com/p/monetization-terms',
                  )
                }
                style={ThemedStyles.style.link}>
                {t('Terms')}
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

export default withErrorBoundaryScreen(
  InAppVerificationOnboardingScreen,
  'InAppVerificationOnboardingScreen',
);
