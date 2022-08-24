import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useBackHandler } from '@react-native-community/hooks';

import apiService from '~/common/services/api.service';
import logService from '~/common/services/log.service';
import { B1, Button, ModalFullScreen } from '~/common/ui';
import { useLegacyStores } from '~/common/hooks/use-stores';
import ThemedStyles from '~/styles/ThemedStyles';

const openTerms = () => {
  Linking.openURL('https://www.minds.com/p/terms');
};

const openContent = () => {
  Linking.openURL('https://www.minds.com/content-policy');
};

export default function TosScreen({ navigation }) {
  const [error, setError] = React.useState(false);
  const { user } = useLegacyStores();

  // Disable back button on Android
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  const ok = async () => {
    setError(false);
    try {
      const response = await apiService.post<any>('api/v2/settings/tos');
      user.setTosLastUpdate(response.timestamp);
      navigation.goBack();
    } catch (err) {
      setError(true);
      logService.exception('[TosModal]', err);
    }
  };

  return (
    <ModalFullScreen title="TOS Update">
      <ScrollView
        contentContainerStyle={[
          ThemedStyles.style.padding3x,
          ThemedStyles.style.paddingTop6x,
        ]}>
        <B1 align="justify">
          We've recently updated our{' '}
          <B1 onPress={openTerms} color="link">
            Terms of Service
          </B1>
          {' and '}
          <B1 onPress={openContent} color="link">
            Content Policy
          </B1>{' '}
          to reflect the changes to our network
        </B1>

        <B1 align="justify" top="L">
          Please also note that your continued use of Minds serves as acceptance
          of these new terms and policies. Thank you.
        </B1>
        {error && (
          <B1 color="danger" top="XL">
            There was an error please try again.
          </B1>
        )}

        <Button onPress={ok} top="XXXL2" type="action" testID="accept">
          Accept
        </Button>
      </ScrollView>
    </ModalFullScreen>
  );
}
