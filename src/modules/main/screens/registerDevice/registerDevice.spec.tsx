import React from 'react';
import {
  cleanup,
  render,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from '../../locales';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegisterDeviceScreen } from './registerDevice.screen';

describe('VerifyOtp page', () => {
  let component: RenderAPI;

  beforeEach(async () => {
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <RegisterDeviceScreen />
        </SafeAreaProvider>,
      ),
    );
  });

  afterEach(() => {
    cleanup();
  });
  it('RegisterDevice snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the RegisterDevice title correctly ', async () => {
    const { result } = renderHook(() => useTranslation());
    const heading = await component.getByText(
      result.current.t('This device will now be registered'),
    );
    expect(heading).toBeTruthy();
  });
});
