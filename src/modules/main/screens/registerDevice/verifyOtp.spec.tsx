import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from '../../locales';
import { VerifyOtpScreen } from './verifyOtp.screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockedRequestOtp: any = jest.fn();
const mockedVerifyOtp: any = jest.fn();
// const mockSetPartyKey = jest.fn();

jest.mock('./registerDevice.logic', () => ({
  useRequestOtpForDeviceChange: function () {
    return {
      requestOtp: mockedRequestOtp,
    };
  },
  useVerifyOtpForDeviceChange: function () {
    return {
      verifyOtp: mockedVerifyOtp,
    };
  },
}));
// jest.mock('services/appStorage', () => ({
//   getPartyKey: function () {
//     return {
//       setPartyKey: mockSetPartyKey,
//     };
//   },
// }));

describe('VerifyOtp page', () => {
  let component: RenderAPI;

  beforeEach(async () => {
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <VerifyOtpScreen />
        </SafeAreaProvider>,
      ),
    );
  });

  afterEach(() => {
    cleanup();
  });
  it('VerifyOtp snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the VerifyOtp instructions correctly ', async () => {
    const { result } = renderHook(() => useTranslation());
    const heading = await component.getByText(
      result.current.t('Enter the 6-digit code'),
    );
    expect(heading).toBeTruthy();
  });
  it('renders the VerifyOtp message correctly ', async () => {
    const { result } = renderHook(() => useTranslation());
    const heading = await component.getByText(
      result.current.t('We have sent an SMS'),
    );
    expect(heading).toBeTruthy();
  });

  it('request otp is called on load', async () => {
    const { getByTestId } = component;
    fireEvent.press(getByTestId('submit-button'));
    mockedRequestOtp.mockImplementation(() => Promise.resolve());
    expect(mockedRequestOtp).toHaveBeenCalled();
  });
  it('verify otp is called on SUBMIT', async () => {
    const { getByTestId } = component;
    fireEvent.press(getByTestId('submit-button'));
    mockedVerifyOtp.mockImplementation(() => Promise.resolve());
    expect(mockedVerifyOtp).toHaveBeenCalled();
  });
});
