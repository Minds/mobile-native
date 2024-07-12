export const createNativeStackNavigator = jest.fn().mockImplementation(() => {
  return {
    Navigator: jest.fn(),
    Screen: jest.fn(),
  };
});
