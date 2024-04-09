// @ts-nocheck
import apiService from '../common/services/api.service';
import NavigationService from '../navigation/NavigationService';
import createComposeStore from './createComposeStore';
import { SupermindRequestParam } from './SupermindComposeScreen';
import { confirm } from '../common/components/Confirm';
import api from '../common/services/api.service';
import { confirmSupermindReply } from './SupermindConfirmation';
import PermissionsService from '~/common/services/permissions.service';

jest.mock('../common/services/permissions.service');
jest.mock('../navigation/NavigationService');
jest.mock('../common/components/Confirm');
jest.mock('./SupermindConfirmation');
jest.mock('../common/services/api.service', () => ({
  post: jest.fn(),
  rawPost: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  upload: jest.fn(),
  delete: jest.fn(),
  clearCookies: jest.fn(),
  buildAuthorizationHeader: jest.fn(),

  isApiError: jest.fn(),
  isNetworkError: jest.fn(),
  isAbort: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof apiService>;
const mockedConfirm = confirm as jest.Mock<typeof confirm>;
const mockedConfirmSupermindReply = confirmSupermindReply as jest.Mock<
  typeof confirmSupermindReply
>;

jest.mock('../common/services/minds-config.service', () => ({
  settings: {
    plus: {
      support_tier_urn: '',
    },
  },
}));

jest.mock('../common/services/analytics.service');

const mockedNavigation = {
  setParams: jest.fn(),
};

describe('createComposeStore', () => {
  let store;

  beforeEach(() => {
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {},
    });
    store.onScreenFocused();
    PermissionsService.canCreatePost.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have the correct default values', () => {
    expect(store.allowedMode).toBeNull();
    expect(store.supermindRequest).toBeUndefined();
  });

  it('should set allowedMode from route params', () => {
    const expectedAllowedMode = 'photo';
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {
        params: {
          allowedMode: expectedAllowedMode,
        },
      },
    });
    store.onScreenFocused();
    expect(store.allowedMode).toBe(expectedAllowedMode);
  });

  it('should open supermind modal', () => {
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {
        params: {
          openSupermindModal: true,
        },
      },
    });
    store.onScreenFocused();
    expect(NavigationService.navigate).toHaveBeenCalledWith(
      'SupermindCompose',
      expect.anything(),
    );
  });

  it('should open supermind modal with an entity', () => {
    const fakeOwnerObj = {};
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {
        params: {
          openSupermindModal: true,
          entity: {
            ownerObj: fakeOwnerObj,
          },
        },
      },
    });
    store.onScreenFocused();
    expect(NavigationService.navigate).toHaveBeenCalledWith(
      'SupermindCompose',
      {
        closeComposerOnClear: true,
        data: { channel: fakeOwnerObj },
        onSave: expect.any(Function),
        onClear: expect.any(Function),
      },
    );
  });

  it('should open supermind modal with a targetChannel', () => {
    const fakeOwnerObj = {};
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {
        params: {
          openSupermindModal: true,
          supermindTargetChannel: fakeOwnerObj,
        },
      },
    });
    store.onScreenFocused();
    expect(NavigationService.navigate).toHaveBeenCalledWith(
      'SupermindCompose',
      {
        closeComposerOnClear: true,
        data: { channel: fakeOwnerObj },
        onSave: expect.any(Function),
        onClear: expect.any(Function),
      },
    );
  });

  it('should submit a supermind', async () => {
    const fakeReq = await createASupermind();
    expect(apiService.put).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        supermind_request: {
          ...fakeReq,
          receiver_guid: fakeReq.channel.guid,
          receiver_username: fakeReq.channel.username,
        },
      }),
    );
  });

  it('should not monetize if a supermind is active', () => {
    store.saveMembsershipMonetize({ urn: 'fake-urn' });
    createASupermind();
    expect(apiService.put).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.objectContaining({
        paywall: true,
      }),
    );
  });

  it('should reply to a supermind correctly', async () => {
    const supermindGuid = 'supermindFakeGuid';
    mockedConfirm.mockReturnValue(true);
    mockedConfirmSupermindReply.mockReturnValue(true);
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {
        params: {
          supermindObject: {
            guid: supermindGuid,
          },
        },
      },
    });
    store.onScreenFocused();
    await createASupermind();
    expect(apiService.put).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        supermind_reply_guid: supermindGuid,
      }),
    );
  });

  it('should not reply to a supermind if user didnt confirm', async () => {
    const supermindGuid = 'supermindFakeGuid';
    mockedConfirm.mockReturnValue(false);
    mockedConfirmSupermindReply.mockReturnValue(false);
    store = createComposeStore({
      navigation: mockedNavigation,
      route: {
        params: {
          supermindObject: {
            guid: supermindGuid,
          },
        },
      },
    });
    store.onScreenFocused();
    await createASupermind();
    expect(apiService.put).not.toHaveBeenCalled();
  });

  const createASupermind = async () => {
    const fakeSupermindRequest = {
      channel: {
        guid: 'fakeGuid',
        username: 'fakeUsername',
      },
      payment_options: {
        payment_type: 1,
        amount: 10,
      },
      reply_type: 0,
      twitter_required: false,
      terms_agreed: true,
    } as SupermindRequestParam;

    store.supermindRequest = fakeSupermindRequest;
    store.text = 'fake post';
    mockedApi.put.mockReturnValueOnce({ supermind: true });

    await store.submit();
    return fakeSupermindRequest;
  };
});
