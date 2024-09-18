import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MText from '../common/components/MText';
import { APP_URI, TENANT } from '../config/Config';

import Input from './components/Input';
import Networks from './components/Networks';
import ReferralsList from './components/ReferralsList';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { Screen, ScreenHeader } from '~/common/ui';
import sp from '~/services/serviceProvider';

interface ReferralsScreenProps {
  navigation: any;
  route: any;
}

const ReferralsScreen = ({ navigation, route }: ReferralsScreenProps) => {
  const theme = sp.styles.style;
  const user = sp.session.getUser();
  const { title } = route.params ?? {};

  const referralLink = `${APP_URI}register?referrer=${user.username}`;
  const i18n = sp.i18n;
  return (
    <Screen safe>
      <ScreenHeader back title={title ?? i18n.t('settings.referrals')} />
      <ScrollView
        style={theme.flexContainer}
        contentContainerStyle={[theme.padding4x]}>
        <MText
          style={[
            theme.fontXL,
            theme.bold,
            theme.marginBottom4x,
            styles.title,
          ]}>
          {i18n.t('referrals.title', { TENANT })}
        </MText>

        <MText
          style={[
            theme.colorSecondaryText,
            theme.textJustify,
            theme.marginBottom,
          ]}>
          {i18n.t('referrals.description', { TENANT })}
        </MText>

        <Input
          textToCopy={referralLink}
          label={i18n.t('referrals.sendLinkToFriends')}
          style={theme.marginBottom4x}
        />

        <Input
          textToCopy={`?referrer=${user.username}`}
          label={i18n.t('referrals.codeSuffixLabel', { TENANT })}
          style={theme.marginBottom4x}
        />

        <Networks referralLink={referralLink} />

        <ReferralsList navigation={navigation} />
      </ScrollView>
    </Screen>
  );
};

export default withErrorBoundaryScreen(ReferralsScreen, 'ReferralScreen');

const styles = StyleSheet.create({
  title: { lineHeight: 25 },
});
