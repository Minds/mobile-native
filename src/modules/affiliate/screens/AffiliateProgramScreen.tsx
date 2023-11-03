import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import {
  B1,
  B2,
  B3,
  Button,
  H2,
  H3,
  Row,
  Screen,
  ScreenHeader,
  ScreenSection,
  Spacer,
} from '~/common/ui';
import { useTranslation } from '../locales';
import { View, ViewStyle } from 'react-native';
import LinksMindsSheet from '../components/LinksMindsSheet';
import InviteToMindsSheet from '../components/InviteToMindsSheet';
import TotalEarnings from '../components/TotalEarnings';
import OnboardingOverlay from '~/components/OnboardingOverlay';
import FitScrollView from '~/common/components/FitScrollView';
import { useIsGoogleFeatureOn } from 'ExperimentsProvider';

export default function AffiliateProgramScreen({ navigation }) {
  const { t } = useTranslation();
  const linkBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const inviteBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const hideTokens = useIsGoogleFeatureOn('mob-5221-google-hide-tokens');

  return (
    <Screen safe onlyTopEdge>
      <ScreenHeader title={t('screenTitle')} back />
      <FitScrollView>
        <LinksMindsSheet ref={linkBottomSheetRef} />
        <InviteToMindsSheet ref={inviteBottomSheetRef} />
        <ScreenSection top="XL">
          <B1>{t('screenDescription')}</B1>
          <Section title="Affiliate" color="#6D28D9" />
          <B2 color="secondary">
            Earn 45% of all sales you refer for Boost, Minds+/Pro.
          </B2>
          <Button
            vertical="XXXL"
            type="action"
            align="start"
            onPress={() => {
              linkBottomSheetRef.current?.present();
            }}>
            Refer and earn
          </Button>
          <H2>Invite your friends to Minds</H2>
          <B2 color="secondary" vertical="L">
            Track rewards for friends that use your invite code to sign up on
            Minds. Earn for up to 1 year.
          </B2>
          <Section title="Affiliate Referral" color="#3B82F6" />
          <B2 color="secondary">
            Earn 5% of all sales your affiliates refer to others.
          </B2>
          <Section title="Creator Referral" color="#92C5FD" />
          <B2 color="secondary">
            Earn 5% of what any referred creator earns through features like
            Supermind, Memberships, and Tips.
          </B2>

          <Button
            vertical={hideTokens ? 'XL' : undefined}
            top="XXXL"
            mode="outline"
            type="action"
            onPress={() => {
              inviteBottomSheetRef.current?.present();
            }}>
            Invite and earn
          </Button>
          {hideTokens ? undefined : (
            <>
              <TotalEarnings />
              <Row align="centerBetween" top="XL">
                <Button
                  mode="outline"
                  onPress={() => {
                    navigation.navigate('Wallet', {
                      currency: 'cash',
                      section: 'earnings',
                    });
                  }}>
                  View earnings
                </Button>
              </Row>
              <B3 vertical="XL">
                Note - You will be credited as the click referrer for any
                purchases of Boosts and subscriptions (Minds+ and Pro) they make
                for the next 72 hours.
              </B3>
            </>
          )}
        </ScreenSection>
      </FitScrollView>
      <OnboardingOverlay type="affiliates" />
    </Screen>
  );
}

const Section = ({
  title,
  color,
}: {
  title: string;
  color: ViewStyle['backgroundColor'];
}) => (
  <Spacer top="XL">
    <H3>{title}</H3>
    <TitleLine color={color} />
  </Spacer>
);

const TitleLine = ({ color }: { color: ViewStyle['backgroundColor'] }) => (
  <View
    // eslint-disable-next-line react-native/no-inline-styles
    style={{
      backgroundColor: color,
      height: 5,
      borderRadius: 2.5,
      width: 90,
      marginVertical: 14,
    }}
  />
);
