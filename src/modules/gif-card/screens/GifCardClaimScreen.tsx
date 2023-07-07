import React from 'react';
import {
  B1,
  B2,
  Button,
  Icon,
  Row,
  Screen,
  ScreenHeader,
  ScreenSection,
} from '~/common/ui';
import { AnimatePresence, MotiView } from 'moti';
import { Trans } from 'react-i18next';

import { useTranslation } from '../locales';
import GiftCard from '../components/GiftCard';
import AnimatedLottieView from 'lottie-react-native';
import FitScrollView from '~/common/components/FitScrollView';
import {
  useClaimGiftCardMutation,
  useGetGiftCardByCodeQuery,
} from '~/graphql/api';
import CenteredLoading from '~/common/components/CenteredLoading';
import { AppStackScreenProps } from '~/navigation/NavigationTypes';
import { showNotification } from 'AppMessages';

type Props = AppStackScreenProps<'GifCardClaim'>;

export function GifCardClaimScreen({ navigation, route }: Props) {
  const { t } = useTranslation();

  const code = route.params?.code;

  if (!code) {
    showNotification('Gift card code is required');
    navigation.goBack();
  }

  const { data, error, isLoading, refetch } = useGetGiftCardByCodeQuery({
    claimCode: code,
  });

  const claimMutation = useClaimGiftCardMutation();

  const action = error
    ? refetch
    : () => claimMutation.mutate({ claimCode: code });

  const claimed = claimMutation.isSuccess;

  const buttonText = error
    ? t('claim.errorButton')
    : data?.giftCardByClaimCode.claimedAt
    ? t('claim.alreadyClaimed')
    : t('claim.button');

  return (
    <Screen safe>
      {claimed && <Confetti />}
      <FitScrollView>
        <AnimatePresence exitBeforeEnter>
          {!claimed ? (
            <AnimatedContainer key="claim">
              <ScreenHeader title={t('claim.title')} back />
              <ScreenSection top="XL">
                <B2 color="secondary">{t('claim.description')}</B2>
                <ScreenSection top="XL">
                  {isLoading && <CenteredLoading />}
                  {data?.giftCardByClaimCode !== undefined && (
                    <GiftCard gift={data.giftCardByClaimCode} />
                  )}
                  {Boolean(error) && <ErrorMessage />}
                  {!isLoading && (
                    <Button
                      disabled={Boolean(data?.giftCardByClaimCode.claimedAt)}
                      loading={claimMutation.isLoading}
                      mode="outline"
                      top="XL"
                      type="action"
                      onPress={action}>
                      {buttonText}
                    </Button>
                  )}
                </ScreenSection>
              </ScreenSection>
            </AnimatedContainer>
          ) : (
            <AnimatedContainer key="claimed">
              <ScreenHeader title={t('claimed.title')} back />
              <ScreenSection top="XL">
                <B1 color="primary" font="bold" bottom="L">
                  {t('claimed.subtitle')}
                </B1>

                <B1 color="primary" font="medium" bottom="L">
                  {t('claimed.detail')}{' '}
                  <B1 color="link" font="medium">
                    ${data?.giftCardByClaimCode.amount}
                  </B1>
                </B1>
                <B2 color="secondary">
                  <Trans
                    i18nKey="claimed.description"
                    t={t}
                    components={[
                      <B2
                        color="link"
                        onPress={() =>
                          navigation.navigate('More', { screen: 'Wallet' })
                        }
                      />,
                    ]}
                  />
                  {'\n\n' + t('claimed.description2')}
                </B2>
                <ScreenSection top="XL">
                  <Button
                    mode="outline"
                    top="XL"
                    type="action"
                    onPress={() =>
                      // @ts-ignore
                      navigation.navigate('Compose', { createMode: 'boost' })
                    }>
                    {t('claimed.button')}
                  </Button>
                </ScreenSection>
              </ScreenSection>
            </AnimatedContainer>
          )}
        </AnimatePresence>
      </FitScrollView>
    </Screen>
  );
}

const AnimatedContainer = ({
  children,
  key,
}: {
  children: React.ReactNode;
  key: string;
}) => {
  return (
    <MotiView
      key={key}
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 1.1,
      }}
      exitTransition={{ type: 'timing', duration: 400 }}>
      {children}
    </MotiView>
  );
};

const Confetti = () => (
  <AnimatedLottieView
    autoPlay={true}
    resizeMode="cover"
    source={require('~/assets/animations/confetti.json')}
    loop={false}
    enableMergePathsAndroidForKitKatAndAbove
    speed={2}
  />
);

const ErrorMessage = () => {
  const { t } = useTranslation();
  return (
    <Row align="centerBoth" vertical="XL">
      <Icon name="warning" color="TertiaryText" right="S" />
      <B1 color="secondary" font="medium" align="center">
        {t('claim.error')}
      </B1>
    </Row>
  );
};
