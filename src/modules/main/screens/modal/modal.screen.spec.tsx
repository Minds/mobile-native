import React from 'react';
import {
  render,
  cleanup,
  RenderAPI,
  waitFor,
  renderHook,
} from '@testing-library/react-native';
import { TFunction } from 'i18next';
import { ModalScreen } from './modal.screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from '../../locales';

describe('Modal page', () => {
  let component: RenderAPI;
  let t: TFunction<'mainModule', undefined>;
  beforeEach(async () => {
    t = renderHook(() => useTranslation()).result.current.t;
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        title: t('title'),
        message: 'message',
        dismissAfter: 3,
      },
    });
    component = await waitFor(() =>
      render(
        <SafeAreaProvider
          initialSafeAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <ModalScreen />
        </SafeAreaProvider>,
      ),
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('Modal snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });

  it('renders the modal title correctly ', async () => {
    const heading = await component.getByText('title');
    expect(heading).toBeTruthy();
  });
});
