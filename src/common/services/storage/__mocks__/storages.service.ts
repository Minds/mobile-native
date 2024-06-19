import { createMockMMKV } from 'react-native-mmkv/src/createMMKV.mock';

export const storagesService = {
  session: createMockStorage(),
  app: createMockStorage(),
  user: createMockStorage(),
  userPortrait: createMockStorage(),
  userCache: createMockStorage(),
};

export const createUserStore = jest.fn();

function createMockStorage() {
  const m = {
    clearAll: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
    getString: jest.fn(),

    getNumber: jest.fn(),

    getBoolean: jest.fn(),

    getBuffer: jest.fn(),

    getAllKeys: jest.fn(),
    contains: jest.fn(),
    recrypt: jest.fn(),

    getObject: jest.fn(),
    setObject: jest.fn(),
  };

  return m;
}
