import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import SupermindSettingsScreen from './SupermindSettingsScreen';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('connectivity');
const mockedApi = sp.mockService('api');
sp.mockService('analytics');
const mindsConfigService = sp.mockService('config');
sp.mockService('permissions');

jest.mock('~/common/hooks/use-stores');

const navigation = { goBack: jest.fn() };

describe('Supermind settings', () => {
  beforeEach(() => {
    jest.useRealTimers();
    mockedApi.get.mockClear();
    const resp: any = {
      min_cash: '12',
      min_offchain_tokens: '2',
    };
    // @ts-ignore
    mindsConfigService.getSettings.mockReturnValue({
      supermind: {
        min_thresholds: {
          min_cash: 10,
          min_offchain_tokens: 1,
        },
      },
    });

    mockedApi.get.mockResolvedValue(resp);
  });
  afterAll(() => {
    jest.useFakeTimers();
  });

  it('should load data and render correctly', async () => {
    render(<SupermindSettingsScreen navigation={navigation} />);

    // render the screen with the loading indicator
    expect(screen.toJSON()).toMatchSnapshot();

    await waitFor(() => screen.getAllByTestId('tokensInput'), {
      timeout: 15000,
      interval: 100,
    });

    // render the screen with data and the inputs should be shown
    expect(screen.toJSON()).toMatchSnapshot();
  });
  it('should update the store and submit', async () => {
    render(<SupermindSettingsScreen navigation={navigation} />);

    // render the screen with the loading indicator
    expect(screen.toJSON()).toMatchSnapshot();

    await waitFor(() => screen.getAllByTestId('tokensInput'), {
      timeout: 4000,
      interval: 100,
    });

    // fill form
    await fireEvent.changeText(screen.getByTestId('tokensInput'), '2');
    await fireEvent.changeText(screen.getByTestId('cashInput'), '12');

    // tap save
    fireEvent.press(screen.getByTestId('save'));

    // it should call the endpoint
    expect(mockedApi.post).toHaveBeenCalledWith('api/v3/supermind/settings', {
      min_cash: 12,
      min_offchain_tokens: 2,
    });
  });
});
