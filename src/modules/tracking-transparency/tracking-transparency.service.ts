import mindsConfigService from '~/common/services/minds-config.service';
import { IS_IOS, TRACKING_TRANSPARENCY_ENABLED } from '~/config/Config';
import SettingsService from '~/settings/SettingsService';

export async function requestTrackingPermission() {
  if (!TRACKING_TRANSPARENCY_ENABLED || !IS_IOS) {
    return;
  }

  // @ts-ignore - we only have this package available if the tenant has the tracking-transparency module enabled
  const module = await import('expo-tracking-transparency');
  const { status } = await module.requestTrackingPermissionsAsync();
  const optedOut = mindsConfigService.getSettings()?.posthog?.opt_out;
  if (status !== 'granted' && optedOut === false) {
    SettingsService.submitSettings({
      opt_out_analytics: true,
    });
  }
}
