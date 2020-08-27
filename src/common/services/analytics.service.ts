import Tracker from '@snowplow/react-native-tracker';
import DeviceInfo from 'react-native-device-info';
import i18nService from './i18n.service';
import { Dimensions, Platform } from 'react-native';
import { Version } from '../../config/Version';
import BaseModel from '../BaseModel';
import ActivityModel from '../../newsfeed/ActivityModel';
import BlogModel from '../../blogs/BlogModel';

/**
 * Analytics service
 */
export class AnalyticsService {
  async init() {
    await Tracker.initialize({
      // required
      endpoint: 'sp.minds.com',
      namespace: 'mobile',
      appId: 'minds',

      // optional
      method: 'post',
      protocol: 'https',
      base64Encoded: true,
      platformContext: true,
      applicationContext: false,
      lifecycleEvents: false,
      screenContext: true,
      sessionContext: true,
      foregroundTimeout: 600,
      backgroundTimeout: 300,
      checkInterval: 15,
      installTracking: false,
    });

    const screen = Dimensions.get('screen');
    const window = Dimensions.get('window');

    const useragent = `Minds/${Version.VERSION} (${DeviceInfo.getModel()}; ${
      Platform.OS === 'ios' ? 'iOS' : 'Android'
    } ${DeviceInfo.getSystemVersion()}) Version/${
      Version.VERSION
    } Mobile Safari/533.1`;

    Tracker.setSubjectData({
      screenWidth: screen.width,
      screenHeight: screen.height,
      language: i18nService.locale,
      useragent,
      viewportWidth: window.width,
      viewportHeight: window.height,
    });
  }

  /**
   * Track screen view
   * @param screenName
   */
  trackScreenViewEvent(screenName: string) {
    return Tracker.trackScreenViewEvent({ screenName });
  }

  /**
   * track a view event over an entity
   * @param entity
   * @param clientMeta
   */
  trackViewedContent(entity: ActivityModel | BlogModel, clientMeta: any) {
    Tracker.trackSelfDescribingEvent({
      schema: 'iglu:com.minds/view/jsonschema/1-0-0',
      data: {
        entity_guid: entity.guid,
        entity_owner_guid: entity.ownerObj?.guid || entity.owner_guid,
        ...clientMeta,
      },
    });
  }

  /**
   * Track a page view
   * @param pageUrl
   */
  trackPageViewEvent(pageUrl: string) {
    Tracker.trackPageViewEvent({ pageUrl });
  }
}

export default new AnalyticsService();
