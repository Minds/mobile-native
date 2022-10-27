import React from 'react';
import { fireEvent, render, RenderAPI } from '@testing-library/react-native';
import { ResetAccountScreen } from './resetAccount.screen';

// import { mockedGoBack } from 'jestSetup.js';
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from '../../locales';

// jest.mock('services/hooks/navigation', () => ({
//   useNavigation: function () {
//     return {
//       navigate: jest.fn,
//       goBack: jest.fn,
//     };
//   },
// }));

describe('Reset page', () => {
  let component: RenderAPI;

  beforeEach(async () => {
    component = render(<ResetAccountScreen />);
  });

  it('Reset snapshot test', () => {
    expect(component.toJSON).toMatchSnapshot();
  });
  it('renders the Reset account title correctly ', async () => {
    const { result } = renderHook(() => useTranslation());
    const heading = await component.getByText(
      result.current.t('Reset your account'),
    );
    expect(heading).toBeTruthy();
  });
  it('renders the Username subheading correctly ', async () => {
    const { result } = renderHook(() => useTranslation());
    const heading = await component.getByText(
      result.current.t('Please enter your username'),
    );
    expect(heading).toBeTruthy();
  });
  it('Next button is called with GoBack function', async () => {
    const { getByTestId } = component;
    fireEvent.press(getByTestId('next-button'));
    // expect().toHaveBeenCalled();
  });
  it('Go back button is called with GoBack function', async () => {
    const { getByTestId } = component;
    fireEvent.press(getByTestId('go-back-button'));
    // expect().toHaveBeenCalled();
  });
});
