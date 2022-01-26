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
import type GroupModel from '../../groups/GroupModel';
import type UserModel from '../../channel/UserModel';

const IGNORE_SCREENS = ['Comments'];

/**
 * Analytics service
 */
export class AnalyticsService {
  tracker?: ReactNativeTracker;
  previousRouteName = '';
  contexts: EventContext[] = [];

  constructor() {
    this.tracker = createTracker(
      'ma',
      {
        // required
        endpoint: 'sp.minds.com',

        // optional
        method: 'post',
      },
      {
        trackerConfig: {
          appId: 'minds',
          platformContext: true,
          applicationContext: false,
          lifecycleAutotracking: false,
          screenContext: true,
          sessionContext: true,
          installAutotracking: false,
          base64Encoding: true,
        },
        sessionConfig: {
          foregroundTimeout: 600,
          backgroundTimeout: 300,
        },
      },
    );

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
   * Sets the user id
   */
  setUserId(userId: string) {
    this.tracker?.setUserId(userId);
  }

  /**
   * clear contexts array
   */
  clearContexts() {
    this.contexts = [];
  }

  /**
   * Add an experiment
   */
  addExperiment(experimentId: string, variationId: number): void {
    this.tracker?.trackSelfDescribingEvent(
      {
        schema: 'iglu:com.minds/growthbook_experiment/jsonschema/1-0-0',
        data: {
          experiment_id: experimentId,
          variation_id: variationId,
        },
      },
      this.contexts,
    );
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
    return this.tracker?.trackScreenViewEvent(
      { name: screenName },
      this.contexts,
    );
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
              !(
                entity.instanceOf('GroupModel') ||
                entity.instanceOf('UserModel')
              ) && (entity as any).subtype
                ? (entity as any).subtype!
                : '',
            entity_container_guid:
              !(
                entity.instanceOf('GroupModel') ||
                entity.instanceOf('UserModel')
              ) && (entity as any).containerObj!
                ? (entity as any).containerObj!.guid
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
