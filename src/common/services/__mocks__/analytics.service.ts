//@ts-nocheck
export default {
  onNavigatorStateChange: jest.fn(),
  trackScreenViewEvent: jest.fn(),
  trackDeepLinkReceivedEvent: jest.fn(),
  trackEntityView: jest.fn(),
  setUserId: jest.fn(),
  trackPageViewEvent: jest.fn(),
  buildEntityContext: jest.fn(),
  buildClientMetaContext: jest.fn(),
};
