export const useActiveTrack = jest.fn();
export const useIsPlaying = jest.fn(() => ({}));
export const usePlaybackState = jest.fn();
export const useProgress = jest.fn(() => ({}));

export const State = {
  Paused: 'paused',
};

export default {
  add: jest.fn(),
  remove: jest.fn(),
  load: jest.fn(),
  skip: jest.fn(),
  seekTo: jest.fn(),
  setupPlayer: jest.fn(() => Promise.resolve()),
  destroy: jest.fn(),
  reset: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  getQueue: jest.fn(() => Promise.resolve([])),
  getActiveTrackIndex: jest.fn(() => Promise.resolve(undefined)),
};
