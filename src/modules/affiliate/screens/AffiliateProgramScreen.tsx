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

export default function AffiliateProgramScreen({ navigation }) {
  const { t } = useTranslation();
  const linkBottomSheetRef = React.useRef<BottomSheetModal>(null);
  const inviteBottomSheetRef = React.useRef<BottomSheetModal>(null);

  return (
    <Screen safe onlyTopEdge scroll>
      <LinksMindsSheet ref={linkBottomSheetRef} />
      <InviteToMindsSheet ref={inviteBottomSheetRef} />
      <ScreenHeader title={t('screenTitle')} back />
      <ScreenSection top="XL">
        <B1>{t('screenDescription')}</B1>
        <Section title="Affiliate" color="#6D28D9" />
        <B2 color="secondary">
          Earn 45% of all sales you refer for Boost, Minds+/Pro.
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

        <H2 top="XXL2">Invite your friend to Minds</H2>
        <B2 color="secondary" vertical="L">
          Track rewards for friends that use your invite code to sign up on
          Minds. Earn for up to 1 year.
        </B2>
        <Button
          type="action"
          onPress={() => {
            inviteBottomSheetRef.current?.present();
          }}>
          Invite and earn
        </Button>

        <H2 top="XXL">Total Earnings</H2>
        <B2 color="secondary" vertical="L">
          Track your total earnings through your unique affiliate link, for both
          existing and new members on Minds
        </B2>
        <H2>$120.00</H2>
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
          <Button
            mode="outline"
            type="action"
            onPress={() => {
              linkBottomSheetRef.current?.present();
            }}>
            Earn with link
          </Button>
        </Row>
        <B3 vertical="XL">
          Note - You will be credited as the click referrer for any purchases of
          Boosts and subscriptions (Minds+ and Pro) they make for the next 72
          hours.
        </B3>
      </ScreenSection>
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
