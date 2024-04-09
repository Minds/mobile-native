export default class PostHogMock {
  register = jest.fn();
  identify = jest.fn();
  overrideFeatureFlag = jest.fn();
  getFeatureFlag = jest.fn();
  capture = jest.fn();
  screen = jest.fn();
}
