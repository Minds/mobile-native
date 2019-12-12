export default {
  createDrawerNavigator: jest.fn(),
  withNavigation: jest.fn(),
  StackActions: {
    push: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/PUSH"})),
    replace: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/REPLACE"})),
  },
};
export const createAppContainer = jest.fn().mockReturnValue(function NavigationContainer(props) {return null;});
export const createSwitchNavigator = jest.fn().mockImplementation(x => ({router: 'router'}));
export const withNavigation = jest.fn();

export const StackActions = {
  reset: jest.fn()
}
export const NavigationActions = {
  navigate: jest.fn(),
  setParams: jest.fn(),
}