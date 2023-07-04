import { shallow } from 'enzyme';
import React from 'react';
import UserModel from '~/channel/UserModel';
import generateFakeUser from '../../../../__mocks__/fake/channel/UserFactory';
import Recommendation from './Recommendation';
import ChannelRecommendationItem from './components/ChannelRecommendationItem';

const mockEntity = generateFakeUser();

jest.mock('~/common/hooks/useApiFetch', () => () => ({
  result: {
    status: '',
    entities: [
      {
        entity: mockEntity,
        guid: '',
      },
    ],
  },
}));

jest.mock('~/common/hooks/use-stores', () => ({
  useLegacyStores: () => ({
    recentSubscriptions: {
      list() {
        return [];
      },
    },
    dismissal: {
      isDismissed() {
        return false;
      },
      dismiss() {
        return;
      },
    },
  }),
}));

describe('Recommendation', () => {
  test('renders correctly', () => {
    const component = shallow(
      <Recommendation type="channel" location="feed" />,
    );
    expect(component).toMatchSnapshot();
  });
});

describe('ChannelRecommendationItem', () => {
  test('renders correctly', () => {
    const componentItem = shallow(
      <ChannelRecommendationItem channel={UserModel.create(mockEntity)} />,
    );
    expect(componentItem).toMatchSnapshot();
  });
});
