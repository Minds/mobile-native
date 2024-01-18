import * as sp from '@snowplow/react-native-tracker';

import { AnalyticsService } from './analytics.service';
import * as configConstants from '../../config/Config';

jest.mock('@snowplow/react-native-tracker');

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
  });

  it('should instantiate', () => {
    expect(service).toBeInstanceOf(AnalyticsService);
  });

  it('should set a appid for non tenant', () => {
    jest.spyOn(sp, 'createTracker');

    service = new AnalyticsService();

    expect(sp.createTracker).toHaveBeenCalledWith('ma', expect.any(Object), {
      trackerConfig: {
        appId: 'minds',
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
    });
  });

  it('should set an appid for tenant', () => {
    const mockedConstants = configConstants as {
      IS_TENANT: boolean;
      TENANT_ID: number | null;
    };
    mockedConstants.IS_TENANT = true;
    mockedConstants.TENANT_ID = 1;

    jest.spyOn(sp, 'createTracker');

    service = new AnalyticsService();

    expect(sp.createTracker).toHaveBeenCalledWith('ma', expect.any(Object), {
      trackerConfig: {
        appId: 'minds-tenant-1',
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
    });
  });
});
