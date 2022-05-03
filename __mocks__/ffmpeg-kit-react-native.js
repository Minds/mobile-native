export default {
  FFmpegKit: {
    execute: jest.fn(),
    cancel: jest.fn(),
  },
  FFprobeKit: {
    getMediaInformation: jest.fn(),
  },
  ReturnCode: {},
};
