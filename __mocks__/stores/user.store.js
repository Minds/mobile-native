export default function userStoreMockFactory() {
  return {
    me: {},

    setUser: jest.fn(),
    setRewards: jest.fn(),
    clearUser: jest.fn(),
    load: jest.fn(),
    isAdmin: jest.fn(),
    reset: jest.fn(),
  };
}
