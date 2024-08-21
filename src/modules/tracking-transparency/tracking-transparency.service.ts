import mindsConfigService from '~/common/services/minds-config.service';
import { IS_IOS, TRACKING_TRANSPARENCY_ENABLED } from '~/config/Config';
import SettingsService from '~/settings/SettingsService';

export async function requestTrackingPermission() {
  // check for dev in a separate if statement so it is removed from the code in dev mode
  if (!__DEV__) {
    if (TRACKING_TRANSPARENCY_ENABLED) {
      if (!IS_IOS) {
        return;
      }
      try {
        // @ts-ignore - we only have this package available if the tenant has the tracking-transparency module enabled
        const module = await import('expo-tracking-transparency');
        const { status } = await module.requestTrackingPermissionsAsync();
        const optedOut = mindsConfigService.getSettings()?.posthog?.opt_out;
        if (status !== 'granted' && optedOut === false) {
          SettingsService.submitSettings({
            opt_out_analytics: true,
          });
        }
      } catch (error) {
        console.error('Failed to request tracking permissions', error);
      }
    }
  }
}
