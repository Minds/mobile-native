import { observe } from 'mobx';
import PostHog from 'posthog-react-native';

import {
  IS_REVIEW,
  IS_TENANT,
  POSTHOG_API_KEY,
  POSTHOG_HOST,
  TENANT_ID,
} from '~/config/Config';
import BaseModel from '../BaseModel';
import { Metadata } from './metadata.service';
import { DismissIdentifier } from '../stores/DismissalStore';
import type { SessionService } from './session.service';
import type { Storages } from './storage/storages.service';
import type { MindsConfigService } from './minds-config.service';

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

export type EventContext = {
  schema: string;
  data: { [key: string]: any };
};

/**
 * Analytics service
 */
export class AnalyticsService {
  posthog: PostHog;

  previousRouteName = '';
  contexts: EventContext[] = [];
  networkUserId: string | null | undefined;
  userId: string | null | undefined;

  configDisposer;

  constructor(
    private session: SessionService,
    private storages: Storages,
    private config: MindsConfigService,
  ) {
    this.posthog = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      preloadFeatureFlags: false, // We provide these from our backend
      captureNativeAppLifecycleEvents: true, // ? Not sure how relevant these are
      persistence: 'file',
      sendFeatureFlagEvent: false, // Storage not working? We will do ourselves
    });

    // Globally register property
    if (IS_TENANT) {
      this.posthog.register({
        tenant_id: TENANT_ID,
      });
    }

    // if (__DEV__) {
    //   this.posthog.debug();
    // }

    // On logout we should reset posthog
    this.session.onLogout(() => {
      this.posthog.reset();
    });
    this.configDisposer = observe(this.config, 'settings', change => {
      const postHogConfigs = change.newValue?.posthog;

      if (postHogConfigs) {
        const isOptOut = postHogConfigs.opt_out;
        if (isOptOut) {
          this.posthog.optOut();
        } else {
          if (this.posthog.optedOut) {
            this.posthog.optIn();
          }
        }
      }
    });
  }

  setGlobalProperty(key: string, value: string | number | boolean): void {
    this.posthog.register({ [key]: value });
  }

  unsetGlobalProperty(key: string): void {
    this.posthog.unregister(key);
  }

  /**
   * Set if a user has disabled analytics or not
   */
  public setOptOut(optOut: boolean): void {
    const posthostConfig = this.config.getSettings().posthog;
    posthostConfig.opt_out = optOut;
  }

  /**
   * Sets the user id
   */
  setUserId(userId: string) {
    if (!userId) {
      return;
    }

    this.posthog.identify(userId);
    this.userId = userId;
  }

  /**
   * clear contexts array
   */
  clearContexts() {
    this.contexts = [];
  }

  /**
   * Sets up the feature flags from the configs
   */
  initFeatureFlags(): void {
    const featureFlags =
      this.config.getSettings()?.posthog?.feature_flags || {};

    this.posthog.overrideFeatureFlag(featureFlags);
  }

  /**
   * Returns a feature flag from posthog
   */
  getFeatureFlag(key: string): string | boolean {
    const response = this.posthog.getFeatureFlag(key) || false;

    // Record the event
    this.addExperiment(key, response);

    return response;
  }

  /**
   * Add an experiment
   */
  addExperiment(key: string, response: string | boolean): void {
    const CACHE_KEY = `experiment:${key}`;
    const date = this.storages.user?.getNumber(CACHE_KEY);
    if (date && date > Date.now() - 86400000) {
      return; // Do not emit event
    } else {
      this.storages.user?.set(CACHE_KEY, Date.now());
    }
    if (!IS_REVIEW) {
      this.posthog.capture('$feature_flag_called', {
        $feature_flag: key,
        $feature_flag_response: response,
      });
    }
  }

  /**
   * Navigation state change handler
   */
  onNavigatorStateChange = (currentRouteName, currentRouteParams) => {
    if (
      currentRouteName &&
      this.previousRouteName !== currentRouteName &&
      !IGNORE_SCREENS.includes(currentRouteName)
    ) {
      this.trackScreenViewEvent(currentRouteName, currentRouteParams);
    }

    // Save the current route name for later comparison
    this.previousRouteName = currentRouteName;

    // Regiser this property to be sent with all events
    this.posthog.register({
      $screen_name: currentRouteName,
    });
  };

  /**
   * Track screen view
   * @param screenName
   */
  trackScreenViewEvent(screenName: string, screenParams: Object): void {
    const allowedScreenParams = {};

    if (screenParams) {
      for (const [key, value] of Object.entries(screenParams)) {
        if (typeof value === 'string' || typeof value === 'number') {
          allowedScreenParams[key] = value;
        }
      }
    }

    this.posthog.screen(screenName, {
      previous_screen: this.previousRouteName,
      screen_params: allowedScreenParams,
    });
  }

  // track push notification opened
  trackPushNotificationOpenedEvent(url: string): void {
    const UTM_PARAMS = this.getUTMParams(url);
    const UTM_INITIAL_PARAMS = {};

    Object.keys(UTM_PARAMS).forEach(key => {
      UTM_INITIAL_PARAMS['initial_' + key] = UTM_PARAMS[key];
    });

    this.posthog.capture('push_notification_opened', {
      $current_url: url,
      $set: UTM_PARAMS,
      $set_once: UTM_INITIAL_PARAMS,
      ...UTM_PARAMS,
    });
  }

  /**
   * Extract utm params from url
   *
   * @param url
   */
  private getUTMParams(url: string): { [key: string]: string } {
    const urlParams = new URLSearchParams(new URL(url).search);

    const utmParams = {};

    for (const [key, value] of urlParams) {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    }

    return utmParams;
  }

  /**
   * Tracks a deep link received event (triggered by a push notification or a deep link)
   * @param url
   */
  trackDeepLinkReceivedEvent(url: string): void {
    const UTM_PARAMS = this.getUTMParams(url);
    const UTM_INITIAL_PARAMS = {};

    Object.keys(UTM_PARAMS).forEach(key => {
      UTM_INITIAL_PARAMS['initial_' + key] = UTM_PARAMS[key];
    });

    this.posthog.capture('deeplink_opened', {
      $current_url: url,
      $set: UTM_PARAMS,
      $set_once: UTM_INITIAL_PARAMS,
      ...UTM_PARAMS,
    });
  }

  /**
   * track a view event over an entity
   * @param entity
   * @param clientMeta
   */
  trackEntityView(entity: BaseModel, clientMeta: Metadata) {
    // Temporarily disabled
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
    const properties = {};

    for (let context of contexts) {
      if (context.schema === 'iglu:com.minds/entity_context/jsonschema/1-0-0') {
        properties['entity_guid'] = context.data.entity_guid;
        properties['entity_type'] = context.data.entity_type;
        properties['entity_subtype'] = context.data.entity_subtype;
        properties['entity_owner_guid'] = context.data.entity_owner_guid;
      }
    }

    this.posthog.capture('dataref_' + eventType, {
      ref: eventRef,
      ...properties,
    });
  }
}

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
  | 'data-minds-chat-no-chats-empty-list-button'
  | 'data-minds-chat-message-input'
  | 'data-minds-chat-send-message-button'
  | 'data-minds-chat-message'
  | 'data-minds-chat-room-settings-button'
  | 'data-minds-chat-info-delete-button'
  | 'data-minds-chat-room-embed-url-text'
  | 'data-minds-chat-room-message-rich-embed'
  | 'data-minds-chat-request-reject-button'
  | 'data-minds-chat-request-accept-button'
  | 'data-minds-chat-room-list-item'
  | 'data-minds-chat-pending-requests-button'
  | 'data-minds-chat-room-list-new-chat-button'
  | 'data-minds-chat-request-block-user-button'
  | `${DismissIdentifier}:dismiss`;
