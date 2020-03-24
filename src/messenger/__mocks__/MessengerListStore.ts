import { extendObservable } from 'mobx'
import OffsetListStore from '../../common/stores/OffsetListStore';

const mock = jest.fn().mockImplementation(() => {

  return extendObservable({
    offset: '',
    newsearch:true,
    controller: null,
    logout: jest.fn(),
    touchConversation: jest.fn(),
    listen: jest.fn(),
    unlisten: jest.fn(),
    loadList: jest.fn(),
    getCryptoKeys: jest.fn(),
    doSetup: jest.fn(),
    setUnlocking: jest.fn(),
    setLoading: jest.fn(),
    setPrivateKey: jest.fn(),
    setSearch: jest.fn(),
    setRefreshing: jest.fn(),
    pushConversations: jest.fn(),
    clearConversations: jest.fn(),
    refresh: jest.fn(),
    reset: jest.fn(),
    unread: 5,
  },{
    conversations: [],
    refreshing: false,
    loading: false,
    search: '',
    configured: false,
    unlocking: false,
    loaded: false,
  });
});

export default mock;
