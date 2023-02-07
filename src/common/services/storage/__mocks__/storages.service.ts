const mockMMKVApi = () => {
  return {
    getBool: jest.fn(),
    setBool: jest.fn(),
    getString: jest.fn(),
    setString: jest.fn(),
    getMap: jest.fn(),
    setMap: jest.fn(),
    getArray: jest.fn(),
    setArray: jest.fn(),
    getInt: jest.fn(),
    setInt: jest.fn(),
  };
};

export const storages = {
  session: mockMMKVApi(),
  app: mockMMKVApi(),
  user: mockMMKVApi(),
  userPortrait: mockMMKVApi(),
  userCache: mockMMKVApi(),
};

export const createStorage = jest.fn();

export const createUserStore = jest.fn();
