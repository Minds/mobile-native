import {
  SessionStorageService,
  SessionsData,
} from './storage/session.storage.service';
import { SessionService } from './session.service';
import analyticsService from './analytics.service';
import * as configConstants from '../../config/Config';
import { Cookies } from '@react-native-cookies/cookies';

jest.mock('./storage/session.storage.service');
jest.mock('./analytics.service');

const mockedStorage = SessionStorageService as jest.Mocked<
  typeof SessionStorageService
>;
const mockedAnalyticsService = analyticsService as jest.Mocked<
  typeof analyticsService
>;

const cookies: Cookies = {
  minds_pseudoid: {
    name: 'pseudo_id',
    value: 'pseudo_id_here',
  },
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService(new mockedStorage());

    jest
      .spyOn(SessionStorageService.prototype, 'getAll')
      .mockImplementation(() => {
        return <SessionsData>{
          activeIndex: 0,
          data: [
            {
              user: {
                guid: '123',
              },
              cookies,
              sessionExpired: false,
            },
          ],
        };
      });
  });

  it('should instantiate', () => {
    expect(service).toBeInstanceOf(SessionService);
  });

  it('should set a pseudo id for non tenant', () => {
    service.init();

    expect(mockedAnalyticsService.setUserId).toHaveBeenCalledWith(
      'pseudo_id_here',
    );
  });

  it('should set a real user id for tenant', () => {
    const mockedConstants = configConstants as { IS_TENANT: boolean };
    mockedConstants.IS_TENANT = true;

    service.init();

    expect(mockedAnalyticsService.setUserId).toHaveBeenCalledWith('123');
  });
});
