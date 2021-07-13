export const createTracker = () => ({
  setSubjectData: jest.fn(),
  trackScreenViewEvent: jest.fn(),
  trackPageViewEvent: jest.fn(),
  trackSelfDescribingEvent: jest.fn(),
});
