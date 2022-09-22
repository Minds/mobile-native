import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { useNavigation } from '~/../__mocks__/@react-navigation/native';

import SupermindRequest from './SupermindRequest';
import SupermindRequestModel from './SupermindRequestModel';

import supermindRequestFaker from '~/../__mocks__/fake/supermind/SupermindRequestFaker';

// mock dependencies
jest.mock('@react-navigation/native');

// mock local code
jest.mock('~/common/services/session.service');
jest.mock('~/common/hooks/use-stores');

// mock navigation
const navigation = {
  navigate: jest.fn(),
};
useNavigation.mockReturnValue(navigation);

describe('SupermindRequest', () => {
  it('should render inbound', async () => {
    const request = SupermindRequestModel.create(supermindRequestFaker());

    render(<SupermindRequest request={request} />);

    //@ts-ignore jasmin is overwriting types
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('should render outbound', async () => {
    const request = SupermindRequestModel.create(supermindRequestFaker());

    render(<SupermindRequest request={request} outbound />);

    //@ts-ignore jasmin is overwriting types
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('should navigate to composer', async () => {
    const request = SupermindRequestModel.create(supermindRequestFaker());

    render(<SupermindRequest request={request} />);

    fireEvent.press(screen.getByTestId('acceptButton'));

    expect(navigation.navigate).toHaveBeenCalled();
  });

  it('should reject a request', async () => {
    const request = SupermindRequestModel.create(supermindRequestFaker());

    request.reject = jest.fn();

    render(<SupermindRequest request={request} />);

    fireEvent.press(screen.getByTestId('rejectButton'));

    expect(request.reject).toHaveBeenCalled();
  });
});
