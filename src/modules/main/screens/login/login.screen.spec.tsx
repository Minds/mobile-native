import React from 'react';
import {
  cleanup,
  render,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import { LoginScreen } from './login.screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockedCheckDeviceAvailability = true;
// const mockSetLoginUser = jest.fn();
const mockDeviceKey = '1234';
const mockPartyKey = '12244';
const mockIsNewDevice = false;

jest.mock('./login.logic', () => ({
  useDeviceLogin: function () {
    return {
      deviceLogin: jest.fn(),
    };
  },
  useRegisterDevice: function () {
    return {
      checkDeviceAvailability: mockedCheckDeviceAvailability,
    };
  },
  useGetCredentials: function () {
    return {
      deviceKey: mockDeviceKey,
      partyKey: mockPartyKey,
      isNewDevic: mockIsNewDevice,
    };
  },
}));

// jest.mock('services/appStorage', () => ({
//   appStorage: function () {
//     return {
//       setLoginUser: mockSetLoginUser,
//     };
//   },
// }));
describe('Login page', () => {
  let component: RenderAPI;

  beforeEach(async () => {
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <LoginScreen />
        </SafeAreaProvider>,
      ),
    );
  });

  afterEach(() => {
    cleanup();
  });
  it('Login snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the Login title correctly ', async () => {
    const { getByTestId } = component;
    expect(getByTestId('sign-in-text')).toBeTruthy();
  });
});
