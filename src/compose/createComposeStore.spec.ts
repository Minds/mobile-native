import apiService from '../common/services/api.service';
import NavigationService from '../navigation/NavigationService';
import createComposeStore from './createComposeStore';
import { SupermindRequestParam } from './SupermindComposeScreen';
import mindsConfigService from '../common/services/minds-config.service';

jest.mock('../navigation/NavigationService');
jest.mock('../common/services/minds-config.service', () => ({
  settings: {
    plus: {
      support_tier_urn: '',
    },
  },
}));

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
          supermind: true,
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
          supermind: true,
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
          supermind: true,
          entity: {
            supermindTargetChannel: fakeOwnerObj,
          },
        },
      },
    });
    store.onScreenFocused();
    expect(NavigationService.navigate).toHaveBeenCalledWith(
      'SupermindCompose',
      {
        data: { channel: fakeOwnerObj },
        onSave: expect.any(Function),
        onClear: expect.any(Function),
      },
    );
  });

  it('should submit a supermind', () => {
    const fakeReq = createASupermind();
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

  it('should not post to permaweb if a supermind is active', () => {
    store.togglePostToPermaweb();
    createASupermind();
    expect(apiService.put).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.objectContaining({
        post_to_permaweb: true,
      }),
    );
  });

  const createASupermind = () => {
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

    jest.spyOn(apiService, 'put');
    apiService.put.mockReturnValueOnce({ supermind: true });
    store.submit();
    return fakeSupermindRequest;
  };
});
