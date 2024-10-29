// mock @livepeer/react-native
export const LivepeerConfig = {
  setConfig: jest.fn(),
  getConfig: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
};

export const createReactClient = jest.fn();
export const createLivepeerClient = jest.fn();
export const Player = jest.fn();
