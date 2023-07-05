export default {
  withNavigation: jest.fn(),
  StackActions: {
    push: jest
      .fn()
      .mockImplementation(x => ({ ...x, type: 'Navigation/PUSH' })),
    replace: jest
      .fn()
      .mockImplementation(x => ({ ...x, type: 'Navigation/REPLACE' })),
  },
};
export const NavigationContainer = jest
  .fn()
  .mockReturnValue(function NavigationContainer(props) {
    return null;
  });

export const StackActions = {
  reset: jest.fn(),
};
export const CommonActions = {
  navigate: jest.fn(),
  setParams: jest.fn(),
};

export const useRoute = jest.fn();
export const useNavigation = jest.fn();
export const useFocusEffect = jest.fn();

export const DefaultTheme = { colors: {} };
export const DarkTheme = { colors: {} };
export const createNavigationContainerRef = jest.fn();
