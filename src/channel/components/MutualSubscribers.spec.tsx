import React from 'react';
import { shallow } from 'enzyme';
import MutualSubscribers from './MutualSubscribers';
import generateFakeUser from '../../../__mocks__/fake/channel/UserFactory';
import UserModel from '../UserModel';

const mockEntity = generateFakeUser();

jest.mock('~/common/hooks/useApiFetch', () => () => ({
  result: {
    status: '',
    count: 10,
    users: [mockEntity, mockEntity, mockEntity, mockEntity, mockEntity],
  },
}));

describe('MutualSubscribers', () => {
  test('renders correctly', () => {
    const component = shallow(
      <MutualSubscribers navigation={{}} channel={new UserModel()} />,
    );
    expect(component).toMatchSnapshot();
  });
});
