import {
  createTracker,
  EventContext,
  ReactNativeTracker,
} from '@snowplow/react-native-tracker';
import { v4 as uuidv4 } from 'uuid';
import DeviceInfo from 'react-native-device-info';
import { Dimensions, Platform } from 'react-native';

import i18nService from './i18n.service';
import { Version } from '../../config/Version';
import { storages } from './storage/storages.service';
import { IS_IOS, IS_TENANT, TENANT_ID } from '~/config/Config';
import BaseModel from '../BaseModel';
import { Metadata } from './metadata.service';
import { DismissIdentifier } from '../stores/DismissalStore';
import { cookieService } from '~/auth/CookieService';

const IGNORE_SCREENS = ['Comments'];

// entity that can be contextualized into an 'entity_context'.
export type ContextualizableEntity = {
  guid: string;
  type?: string;
  subtype: string;
  access_id: string;
  container_guid?: string;
  owner_guid: string;
  ownerObj?: {
    guid: string;
  };
};

/**
 * Analytics service
 */
export class AnalyticsService {
  tracker?: ReactNativeTracker;
  previousRouteName = '';
  contexts: EventContext[] = [];
  networkUserId: string | null | undefined;
  userId: string | null | undefined;

  constructor() {
    let appId = 'minds';

    if (IS_TENANT) {
      appId = 'minds-tenant-' + TENANT_ID;
    }

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
          appId: appId,
          platformContext: true,
          applicationContext: false,
          lifecycleAutotracking: false,
          screenContext: true,
          sessionContext: true,
          installAutotracking: false,
          base64Encoding: true,
          deepLinkContext: true,
          logLevel: 'debug',
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

    // set a cookie
    if (!IS_IOS) {
      // we set the network explicitly here, as setting it on the subject data doesn't work
      this.networkUserId = storages.app.getString('snowplow_network_id');
      if (!this.networkUserId) {
        this.networkUserId = uuidv4() as string;
        storages.app.setString(
          'snowplow_network_id',
          this.networkUserId as string,
        );
        console.log(
          '[Snowplow] Generated network user id: ',
          this.networkUserId,
        );
      } else {
        console.log('[Snowplow] network user id: ', this.networkUserId);
      }
      this.tracker.setNetworkUserId(this.networkUserId);
      this.setNetworkCookie();
    }

    this.tracker.setSubjectData({
      screenResolution: [screen.width, screen.height],
      language: i18nService.locale,
      useragent,
      screenViewport: [window.width, window.height],
    });
  }

  /**
   * Sets the networkId cookie
   */
  setNetworkCookie() {
    if (this.networkUserId) {
      cookieService.set({
        name: 'minds_sp',
        value: this.networkUserId,
        secure: true,
      });
    }
  }

  /**
   * Sets the user id
   */
  setUserId(userId: string) {
    if (!userId) {
      return;
    }
    this.tracker?.setUserId(userId);
    this.userId = userId;
    cookieService.set({
      name: 'minds_pseudoid',
      value: this.userId,
    });
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
  onNavigatorStateChange = currentRouteName => {
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
   * Tracks a deep link received event
   * @param url
   */
  trackDeepLinkReceivedEvent(url: string) {
    return this.tracker?.trackDeepLinkReceivedEvent({
      url,
    });
  }

  /**
   * track a view event over an entity
   * @param entity
   * @param clientMeta
   */
  trackEntityView(entity: BaseModel, clientMeta: Metadata) {
    this.tracker?.trackSelfDescribingEvent(
      {
        schema: 'iglu:com.minds/view/jsonschema/1-0-0',
        data: {
          ...(clientMeta as Record<keyof Metadata, unknown>),
          entity_guid: entity.guid,
          // @ts-ignore
          entity_type: entity.type,
          entity_owner_guid: entity.ownerObj?.guid || entity.owner_guid,
        },
      },
      [
        {
          schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
          data: {
            entity_guid: entity.guid,
            entity_owner_guid: entity.ownerObj?.guid || entity.owner_guid,
            // @ts-ignore
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

  /**
   * Tracks a generic view event.
   * @param { string } ref - a string identifying the source of the click action.
   * @param { EventContext[] } contexts - additional contexts.
   * @returns { void }
   */
  public trackView(ref: string, contexts: EventContext[] = []): void {
    return this.trackGenericEvent('view', ref, contexts);
  }

  /**
   * Tracks a click event.
   * @param { string } ref - a string identifying the source of the click action.
   * @param { EventContext[] } contexts - additional contexts.
   * @returns { void }
   */
  public trackClick(ref: ClickRef, contexts: EventContext[] = []): void {
    return this.trackGenericEvent('click', ref, contexts);
  }

  /**
   * Build entity context for a given entity.
   * @param { ContextualizableEntity } entity - entity to build entity_context for.
   * @returns { EventContext } - built entity_context.
   */
  public buildEntityContext(entity: ContextualizableEntity): EventContext {
    return {
      schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
      data: {
        entity_guid: entity.guid ?? null,
        entity_type: entity.type ?? null,
        entity_subtype: entity.subtype ?? null,
        entity_owner_guid: entity.owner_guid ?? null,
        entity_access_id: entity.access_id ?? null,
        entity_container_guid: entity.container_guid ?? null,
      },
    };
  }

  /**
   * Build client meta context for a given entity.
   * @param { ContextualizableEntity } entity - entity to build entity_context for.
   * @returns { EventContext } - built entity_context.
   */
  public buildClientMetaContext(metadata: Metadata): EventContext {
    return {
      schema: 'iglu:com.minds/client_meta/jsonschema/1-0-0',
      data: {
        ...metadata,
      },
    };
  }

  /**
   * Tracks a generic event.
   * @param { string } eventType - the type of this event e.g. view, click, etc.
   * @param { string } eventRef - a string identifying the source of this action.
   * @param  { EventContext[] } contexts
   */
  private trackGenericEvent(
    eventType: string,
    eventRef: string,
    contexts: EventContext[] = [],
  ): void {
    this.tracker?.trackSelfDescribingEvent(
      {
        schema: 'iglu:com.minds/generic_event/jsonschema/1-0-0',
        data: {
          event_type: eventType,
          event_ref: eventRef,
        },
      },
      [...(this.contexts ?? []), ...contexts],
    );
  }
}

export default new AnalyticsService();

export type ClickRef =
  | 'share'
  | 'sendTo'
  | 'comment'
  | 'vote:up'
  | 'vote:down'
  | 'push-notification'
  | 'video-player-unmuted'
  | 'remind'
  | 'banner:afiliate:action'
  | 'discovery:plus:upgrade'
  | `${DismissIdentifier}:dismiss`;
