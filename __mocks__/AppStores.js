export default {
  keychain: {
    waitForUnlock: jest.fn()
  },
  user: {
    me: {},
    load: jest.fn(),
    setUser: jest.fn()
  }
}