import { useDimensions } from '@react-native-community/hooks';
import React, { useCallback, useRef } from 'react';
import { ScrollView, Text } from 'react-native';
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
        style={[
          theme.colorSecondaryText,
          theme.textJustify,
          theme.marginBottom4x,
        ]}>
        {i18n.t('referrals.description')}
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
