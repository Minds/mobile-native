import {
  createTracker,
  EventContext,
  ReactNativeTracker,
} from '@snowplow/react-native-tracker';
import DeviceInfo from 'react-native-device-info';
import i18nService from './i18n.service';
import { Dimensions, Platform } from 'react-native';
import { Version } from '../../config/Version';
import type ActivityModel from '../../newsfeed/ActivityModel';
import type BlogModel from '../../blogs/BlogModel';
import { getTopLevelNavigator } from '../../navigation/NavigationService';
import GroupModel from '../../groups/GroupModel';
import UserModel from '../../channel/UserModel';

const IGNORE_SCREENS = ['Comments'];

/**
 * Analytics service
 */
export class AnalyticsService {
  tracker?: ReactNativeTracker;
  previousRouteName = '';
  contexts: EventContext[] = [];

  constructor() {
    this.tracker = createTracker('ma', {
      // required
      endpoint: 'sp.minds.com',
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
    } ${DeviceInfo.getSystemVersion()}) Version/${Version.VERSION}`;

    this.tracker.setSubjectData({
      screenWidth: screen.width,
      screenHeight: screen.height,
      language: i18nService.locale,
      useragent,
      viewportWidth: window.width,
      viewportHeight: window.height,
    });
  }

  /**
   * clear contexts array
   */
  clearContexts() {
    this.contexts = [];
  }

  /**
   * Add an experiment context
   */
  addExperimentContext(experimentId: string, variationId: number): void {
    this.contexts.push({
      schema: 'iglu:com.minds/growthbook_context/jsonschema/1-0-1',
      data: {
        experiment_id: experimentId,
        variation_id: variationId,
      },
    });
  }

  /**
   * Navigation state change handler
   */
  onNavigatorStateChange = () => {
    const nav: any = getTopLevelNavigator();
    if (!nav) {
      return;
    }
    const currentRouteName = nav.getCurrentRoute()?.name;

    if (
      currentRouteName &&
      this.previousRouteName !== currentRouteName &&
      !IGNORE_SCREENS.includes(currentRouteName)
    ) {
      this.trackScreenViewEvent(currentRouteName);
    }

    // Save the current route name for later comparison
    this.previousRouteName = currentRouteName;
  };

  /**
   * Track screen view
   * @param screenName
   */
  trackScreenViewEvent(screenName: string) {
    return this.tracker?.trackScreenViewEvent({ screenName }, this.contexts);
  }

  /**
   * track a view event over an entity
   * @param entity
   * @param clientMeta
   */
  trackViewedContent(
    entity: ActivityModel | BlogModel | GroupModel | UserModel,
    clientMeta: any,
  ) {
    this.tracker?.trackSelfDescribingEvent(
      {
        schema: 'iglu:com.minds/view/jsonschema/1-0-0',
        data: {
          entity_guid: entity.guid,
          entity_owner_guid: entity.ownerObj?.guid || entity.owner_guid,
          ...clientMeta,
        },
      },
      [
        {
          schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
          data: {
            entity_guid: entity.guid,
            entity_owner_guid: entity.ownerObj?.guid || entity.owner_guid,
            entity_type: entity.type,
            entity_subtype:
              !(entity instanceof GroupModel || entity instanceof UserModel) &&
              entity.subtype
                ? entity.subtype
                : '',
            entity_container_guid:
              !(entity instanceof GroupModel || entity instanceof UserModel) &&
              entity.containerObj
                ? entity.containerObj.guid
                : '',
          },
        },
        ...this.contexts,
      ],
    );
  }

  /**
   * Track a page view
   * @param pageUrl
   */
  trackPageViewEvent(pageUrl: string) {
    this.tracker?.trackPageViewEvent({ pageUrl }, this.contexts);
  }
}

export default new AnalyticsService();
