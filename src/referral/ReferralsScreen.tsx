import React from 'react';
import { Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { navToTokens } from '../buy-tokens/BuyTokensScreen';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import { MINDS_URI } from '../config/Config';
import ThemedStyles from '../styles/ThemedStyles';
import Input from './components/Input';
import Networks from './components/Networks';
import ReferralsList from './components/ReferralsList';

interface ReferralsScreenProps {
  navigation: any;
}

const ReferralsScreen = ({ navigation }: ReferralsScreenProps) => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();

  const referralLink = `${MINDS_URI}register?referrer=${user.username}`;

  return (
    <ScrollView
      style={theme.flexContainer}
      contentContainerStyle={[theme.padding4x]}>
      <Text
        style={[theme.fontXL, theme.bold, theme.marginBottom4x, styles.title]}>
        {i18n.t('referrals.title')}
      </Text>

      <Text
        style={[
          theme.colorSecondaryText,
          theme.textJustify,
          theme.marginBottom,
        ]}>
        {i18n.t('referrals.description')}
      </Text>
      <Text
        style={[theme.colorLink, theme.marginBottom4x]}
        onPress={navToTokens}>
        {i18n.t('wallet.learnMore.title')}
      </Text>

      <Input
        textToCopy={referralLink}
        label={i18n.t('referrals.sendLinkToFriends')}
        style={theme.marginBottom4x}
      />

      <Input
        textToCopy={`?referrer=${user.username}`}
        label={i18n.t('referrals.codeSuffixLabel')}
        style={theme.marginBottom4x}
      />

      <Networks referralLink={referralLink} />

      <ReferralsList navigation={navigation} />
    </ScrollView>
  );
};

export default ReferralsScreen;

const styles = StyleSheet.create({
  title: { lineHeight: 25 },
});
