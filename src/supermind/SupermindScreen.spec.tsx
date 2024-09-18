import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import supermindRequestFaker from '../../__mocks__/fake/supermind/SupermindRequestFaker';
import SupermindScreen from './SupermindScreen';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
// mock services
sp.mockService('styles');
const apiService = sp.mockService('api');

jest.mock('../common/services/api.service');
jest.mock('./SupermindRequest', () => () => 'SupermindRequest');

const mockedApi = apiService as jest.Mocked<typeof apiService>;
const guid = 'fakeGuid';

describe('SupermindScreen', () => {
  test('should render correctly', () => {
    mockedApi.get.mockResolvedValue(supermindRequestFaker() as any);
    render(
      <SupermindScreen
        route={
          {
            params: {
              guid,
            },
          } as any
        }
      />,
    );
    expect(apiService.get).toHaveBeenCalledWith(
      '/api/v3/supermind/' + guid,
      expect.anything(),
      expect.anything(),
    );
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
