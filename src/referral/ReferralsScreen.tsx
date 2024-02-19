import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MText from '../common/components/MText';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import { APP_URI } from '../config/Config';
import ThemedStyles from '../styles/ThemedStyles';
import Input from './components/Input';
import Networks from './components/Networks';
import ReferralsList from './components/ReferralsList';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { Screen, ScreenHeader } from '~/common/ui';

interface ReferralsScreenProps {
  navigation: any;
  route: any;
}

const ReferralsScreen = ({ navigation, route }: ReferralsScreenProps) => {
  const theme = ThemedStyles.style;
  const user = sessionService.getUser();
  const { title } = route.params ?? {};

  const referralLink = `${APP_URI}register?referrer=${user.username}`;

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
          {i18n.t('referrals.title')}
        </MText>

        <MText
          style={[
            theme.colorSecondaryText,
            theme.textJustify,
            theme.marginBottom,
          ]}>
          {i18n.t('referrals.description')}
        </MText>

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
    </Screen>
  );
};

export default withErrorBoundaryScreen(ReferralsScreen, 'ReferralScreen');

const styles = StyleSheet.create({
  title: { lineHeight: 25 },
});
