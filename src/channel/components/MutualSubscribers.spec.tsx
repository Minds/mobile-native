import React from 'react';
import { shallow } from 'enzyme';
import MutualSubscribers from './MutualSubscribers';
import generateFakeUser from '../../../__mocks__/fake/channel/UserFactory';

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
      <MutualSubscribers navigation={{}} userGuid="fake" />,
    );
    //@ts-ignore jasmine types overwriting jest types
    expect(component).toMatchSnapshot();
  });
});
