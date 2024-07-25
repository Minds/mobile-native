import { observable, extendObservable } from 'mobx';
import { AnalyticsService } from './analytics.service';
import { MindsConfigService } from './minds-config.service';
import { SessionService } from './session.service';
import { Storages } from './storage/storages.service';

jest.mock('~/common/services/minds-config.service');
jest.mock('~/common/services/session.service');
jest.mock('~/common/services/storage/storages.service');

const storagesService = new Storages();
// @ts-ignore
const sessionService = new SessionService();
// @ts-ignore
const mindsConfigService = new MindsConfigService();

extendObservable(mindsConfigService, {
  settings: observable.box({}),
});

const mockedUserStorage = storagesService.user as jest.Mocked<
  typeof storagesService.user
>;

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService(
      sessionService,
      storagesService,
      mindsConfigService,
    );
  });

  it('should instantiate', () => {
    expect(service).toBeInstanceOf(AnalyticsService);
  });

  it('should identify posthog when userid set', () => {
    jest.spyOn(service.posthog, 'identify');
    service.setUserId('123');
    expect(service.posthog.identify).toHaveBeenCalled();
  });

  it('should update minds config with new opt out', () => {
    jest.spyOn(mindsConfigService, 'getSettings').mockReturnValue({
      posthog: {
        opt_out: false,
      },
    });

    service.setOptOut(true);
  });

  it('should override feature flags from configs', () => {
    jest.spyOn(mindsConfigService, 'getSettings').mockReturnValue({
      posthog: {
        feature_flags: {
          'test-flag': true,
          'test-flag-2': 'control',
        },
      },
    });

    service.initFeatureFlags();

    expect(service.posthog.overrideFeatureFlag).toHaveBeenCalledWith({
      'test-flag': true,
      'test-flag-2': 'control',
    });
  });

  it('should emit feature flag event when getFeatureFlag called and not emitted before', () => {
    jest.spyOn(service.posthog, 'getFeatureFlag').mockReturnValue(true);
    jest.spyOn(service.posthog, 'capture');
    jest.spyOn(<any>mockedUserStorage, 'set');

    expect(service.getFeatureFlag('test-flag')).toBe(true);
    expect(service.posthog.capture).toHaveBeenCalled();
    expect(mockedUserStorage?.set).toHaveBeenCalled();
  });

  it('should not emit feature flag event when getFeatureFlag called and has emitted before', () => {
    jest.spyOn(service.posthog, 'getFeatureFlag').mockReturnValue(true);
    jest.spyOn(service.posthog, 'capture');

    const d = Date.now();
    mockedUserStorage?.getNumber.mockReturnValue(d);

    expect(service.getFeatureFlag('test-flag')).toBe(true);
    expect(service.posthog.capture).not.toHaveBeenCalled();
  });

  it('should emit screen event when nav state changes', () => {
    jest.spyOn(service.posthog, 'capture');

    service.onNavigatorStateChange('MainScreen', {});

    expect(service.posthog.screen).toHaveBeenCalledWith('MainScreen', {
      previous_screen: '',
      screen_params: {},
    });
  });

  it('should emit screen event when nav state changes, with params', () => {
    jest.spyOn(service.posthog, 'capture');

    service.onNavigatorStateChange('ChannelScreen', { guid: '123' });

    expect(service.posthog.screen).toHaveBeenCalledWith('ChannelScreen', {
      previous_screen: '',
      screen_params: {
        guid: '123',
      },
    });
  });

  it('should track a generic click', () => {
    jest.spyOn(service.posthog, 'capture');

    service.trackClick('comment');

    expect(service.posthog.capture).toHaveBeenCalledWith('dataref_click', {
      ref: 'comment',
    });
  });

  it('should track a generic click with entity context', () => {
    jest.spyOn(service.posthog, 'capture');

    service.trackClick('comment', [
      {
        schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
        data: {
          entity_guid: '123',
        },
      },
    ]);

    expect(service.posthog.capture).toHaveBeenCalledWith('dataref_click', {
      ref: 'comment',
      entity_guid: '123',
    });
  });

  it('should track a generic view', () => {
    jest.spyOn(service.posthog, 'capture');

    service.trackView('comment');

    expect(service.posthog.capture).toHaveBeenCalledWith('dataref_view', {
      ref: 'comment',
    });
  });

  it('should track a generic click with entity context', () => {
    jest.spyOn(service.posthog, 'capture');

    service.trackView('comment', [
      {
        schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
        data: {
          entity_guid: '123',
        },
      },
    ]);

    expect(service.posthog.capture).toHaveBeenCalledWith('dataref_view', {
      ref: 'comment',
      entity_guid: '123',
    });
  });
});
