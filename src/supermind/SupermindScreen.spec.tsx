import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import supermindRequestFaker from '../../__mocks__/fake/supermind/SupermindRequestFaker';
import apiService from '../common/services/api.service';
import SupermindScreen from './SupermindScreen';

jest.mock('../common/services/api.service');
jest.mock('./SupermindRequest', () => () => 'SupermindRequest');

const guid = 'fakeGuid';

describe('SupermindScreen', () => {
  test('should render correctly', () => {
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
    apiService.get.mockResolvedValue(supermindRequestFaker());
    expect(apiService.get).toHaveBeenCalledWith(
      '/api/v3/supermind/' + guid,
      expect.anything(),
      expect.anything(),
    );
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
