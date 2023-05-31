export const Font = {
  processFontFamily: jest.fn(),
};

export default {
  ...Font,
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(),
  useFonts: jest.fn(),
};
