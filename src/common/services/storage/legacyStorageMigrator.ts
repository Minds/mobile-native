import AsyncStorage from '@react-native-community/async-storage';
import ThemedStyles from '../../../styles/ThemedStyles';
import logService from '../log.service';
import storageService from '../storage.service';
import { createStorage, storages } from './storages.service';

export async function migrateLegacyStorage() {
  const session = storages.session;
  const app = storages.app;
  const result = await app.getBoolAsync('isMigrated');

  if (!result) {
    let user: any = null;
    try {
      // Migrate session
      const data = await AsyncStorage.multiGet([
        '@MindsStorage:access_token',
        '@MindsStorage:refresh_token',
        '@MindsStorage:logged_in_user',
        '@MindsStorage:private_key',
      ]);

      const accessToken = data[0][1] ? JSON.parse(data[0][1]) : null,
        refreshToken = data[1][1] ? JSON.parse(data[1][1]) : null,
        privateKey = data[3][1];
      user = data[2][1] ? JSON.parse(data[2][1]) : null;

      if (accessToken && refreshToken && user) {
        session.setMap('access_token', accessToken);
        session.setMap('refresh_token', refreshToken);
        session.setMap('user', user);
      }
      if (privateKey) {
        session.setString('private_key', privateKey);
      }
    } catch (error) {
      console.log('Session migration failed', error);
      logService.exception(error);
    }

    try {
      // Migrate settings
      const settings = await storageService.multiGet([
        'LeftHanded',
        'Theme',
        'IgnoreBestLanguage',
        'ComposerMode',
        'IgnoreOnboarding',
        'DataSaverMode',
        'DataSaverModeDisablesOnWiFi',
        '@Minds:Locale',
      ]);

      if (settings && settings.some(d => d[1])) {
        const leftHanded = settings[0][1];
        const theme = settings[1][1] ? parseInt(settings[1][1], 10) : 1;
        const ignoreBestLanguage = settings[2][1] || '';
        const composerMode = settings[3][1] || 'photo';
        const ignoreOnboarding = settings[4][1] || '';

        const settingsSaverMode = Boolean(settings[5][1]);
        const settingsSaverModeDisablesOnWiFi = Boolean(settings[6][1]);

        const locale = settings[7][1] || 'en';

        app.setBool('leftHanded', !!leftHanded);
        app.setInt('theme', theme);
        app.setBool('dataSaverMode', settingsSaverMode);
        app.setBool(
          'dataSaverModeDisablesOnWiFi',
          settingsSaverModeDisablesOnWiFi,
        );
        app.setString('ignoreBestLanguage', ignoreBestLanguage);
        app.setString('locale', locale);
        app.setString('composerMode', composerMode);
        if (user && user.guid) {
          const userStorage = createStorage(`user_${user.guid}`);
          userStorage.setString('ignoreOnboarding', ignoreOnboarding);
        }
        if (theme === 1) {
          ThemedStyles.setDark();
        }
      }
    } catch (error) {
      console.log('settings migration failed', error);
      logService.exception(error);
    }

    app.setBool('isMigrated', true);
  }
}
