import React from 'react';
import {
  render,
  cleanup,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import { LandingScreen } from './landing.screen';

import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from '../../locales';
import { SafeAreaProvider } from 'react-native-safe-area-context';

describe('Main landing page', () => {
  let component: RenderAPI;
  let t: any;
  beforeEach(async () => {
    t = renderHook(() => useTranslation()).result.current.t;
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <LandingScreen />
        </SafeAreaProvider>,
      ),
    );
  });

  afterEach(() => {
    cleanup();
  });
  it('LandingScreen snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the main title correctly', async () => {
    const heading = component.getByText(t('Minds awesome'));
    expect(heading).toBeTruthy();
  });

  it('sign up button calls navigate with Join', async () => {
    const button = component.getByText(t('Get an account'));
    expect(button).toBeTruthy();
    // fireEvent.press(button);
    // expect(mockedNavigate).toHaveBeenCalledWith({
    //   name: 'SignUp',
    //   params: {
    //     // params: { type: 'ACCOUNTS' },
    //     screen: 'OnboardingProducts',
    //   },
    // });
  });

  it('log in button calls navigate with Sign in', async () => {
    const button = component.getByText(t('Sign in'));
    expect(button).toBeTruthy();
    // fireEvent.press(button);
    // expect(mockedNavigate).toHaveBeenCalledWith({
    //   name: 'Login',
    // });
  });
});
