import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TosScreen from './TosScreen';
import apiService from '~/common/services/api.service';

jest.mock('~/common/services/api.service');
jest.mock('~/common/hooks/use-stores', () => ({
  // Mock user store
  useLegacyStores: jest.fn().mockImplementation(() => ({
    user: {
      setTosLastUpdate: jest.fn(),
    },
  })),
}));

const navigation = { goBack: jest.fn() };

test('Tos screen render and accept', async () => {
  render(<TosScreen navigation={navigation} />);

  //@ts-ignore
  apiService.post.mockResolvedValue({ timestamp: '13123123123' });

  fireEvent.press(screen.getByTestId('accept'));

  expect(apiService.post).toHaveBeenCalled();

  //@ts-ignore jasmin is overwriting types
  expect(screen.toJSON()).toMatchSnapshot();
});
