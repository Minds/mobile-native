import React from 'react';
import {
  render,
  cleanup,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import { HomeScreen } from './home.screen';
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from '../../locales';
import { SafeAreaProvider } from 'react-native-safe-area-context';

describe('Main home page', () => {
  let component: RenderAPI;

  beforeEach(async () => {
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <HomeScreen />
        </SafeAreaProvider>,
      ),
    );
  });

  afterEach(() => {
    cleanup();
  });
  it('HomeScreen snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the main title correctly', async () => {
    const { result } = renderHook(() => useTranslation());
    const heading = component.getByText(result.current.t('home page'));
    expect(heading).toBeTruthy();
  });
});
