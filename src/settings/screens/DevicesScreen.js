import React, { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Switch from 'react-native-switch-pro'
import settingsService from '../SettingsService';
import CenteredLoading from '../../common/components/CenteredLoading';
import Button from '../../common/components/Button';
import authService from '../../auth/AuthService';
import { Alert } from 'react-native';

export default function() {
  const CS = ThemedStyles.style;

  const [openedSessions, setOpenedSessions] = useState();
  const [loading, setLoading] = useState(true);

  /**
   * Get mature configuration
   */
  useEffect(() => {
    async function getOpenedSessions() {
      const { channel } = await settingsService.getSettings();
      setOpenedSessions(channel.open_sessions);
      setLoading(false);
    }
    getOpenedSessions();
  }, [setOpenedSessions, setLoading]);

  /**
   * Save changes
   */
  const closeSessions = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logoutAll();
    } catch (err) {
      console.log('error trying logoutALl');
    }
    setLoading(false);
  }, [setLoading]);

  const component = loading ? (<CenteredLoading />) : (
    <View style={[CS.flexContainer, CS.backgroundPrimary]}>
      <View style={[styles.row, CS.backgroundSecondary, CS.paddingVertical2x, CS.paddingHorizontal3x, CS.borderPrimary, CS.borderHair]}>
        <Text style={[styles.text, CS.marginLeft, CS.colorSecondaryText, CS.fontM]}>{i18n.t('settings.sessionsOpened', {amount: openedSessions})}</Text>
        <Button
          onPress={closeSessions}
          text={i18n.t('settings.closeSessions')}
        />
      </View>
    </View>
  )

  return (component);
}

const styles = {
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    width: '50%',
  }
}