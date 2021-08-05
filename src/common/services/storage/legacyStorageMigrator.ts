import AsyncStorage from '@react-native-community/async-storage';
import storageService from '../storage.service';
import { createStorage, storages } from './storages.service';

export async function migrateLegacyStorage() {
  const session = storages.session;
  const app = storages.app;
  const result = await app.getBoolAsync('isMigrated');

  if (!result) {
    // Migrate session
    const data = await AsyncStorage.multiGet([
      '@MindsStorage:access_token',
      '@MindsStorage:refresh_token',
      '@MindsStorage:logged_in_user',
      '@MindsStorage:private_key',
    ]);

    const accessToken = data[0][1] ? JSON.parse(data[0][1]) : null,
      refreshToken = data[1][1] ? JSON.parse(data[1][1]) : null,
      user = data[2][1] ? JSON.parse(data[2][1]) : null,
      privateKey = data[3][1];

    if (accessToken && refreshToken && user) {
      session.setMap('access_token', accessToken);
      session.setMap('refresh_token', refreshToken);
      session.setMap('user', user);
    }

    if (privateKey) {
      session.setString('private_key', privateKey);
    }

    // Migrate settings
    const settings = await storageService.multiGet([
      'LeftHanded',
      'CreatorNsfw',
      'ConsumerNsfw',
      'UseHashtags',
      'Theme',
      'IgnoreBestLanguage',
      'ComposerMode',
      'IgnoreOnboarding',
      'DataSaverMode',
      'DataSaverModeDisablesOnWiFi',
      'SwipeAnimShown',
      '@Minds:Locale',
    ]);

    if (settings) {
      const leftHanded = settings[0][1];
      const creatorNsfw = settings[1][1] || ([] as any);
      const consumerNsfw = settings[2][1] || ([] as any);
      const theme = settings[4][1] ? parseInt(settings[4][1], 10) : 0;
      const ignoreBestLanguage = settings[5][1] || '';
      const composerMode = settings[6][1] || 'photo';
      const ignoreOnboarding = settings[7][1] || '';

      const settingsSaverMode = Boolean(settings[8][1]);
      const settingsSaverModeDisablesOnWiFi = Boolean(settings[9][1]);

      const locale = settings[11][1] || 'en';

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
        userStorage.setArray('creatorNSFW', creatorNsfw);
        userStorage.setArray('consumerNSFW', consumerNsfw);
        userStorage.setString('ignoreOnboarding', ignoreOnboarding);
      }
    }

    app.setBool('isMigrated', true);
  }
}
