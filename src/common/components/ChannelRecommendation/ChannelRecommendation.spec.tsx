import React from 'react';
import ChannelRecommendation, {
  ChannelRecommendationItem,
} from './ChannelRecommendation';
import { shallow } from 'enzyme';
import UserModel from '~/channel/UserModel';
import generateFakeUser from '../../../../__mocks__/fake/channel/UserFactory';

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

describe('ChannelRecommendation', () => {
  test('renders correctly', () => {
    const component = shallow(
      <ChannelRecommendation location="fakeLocation" />,
    );
    //@ts-ignore jasmine types overwriting jest types
    expect(component).toMatchSnapshot();
  });
});

describe('ChannelRecommendationItem', () => {
  test('renders correctly', () => {
    const componentItem = shallow(
      <ChannelRecommendationItem channel={UserModel.create(mockEntity)} />,
    );
    //@ts-ignore jasmine types overwriting jest types
    expect(componentItem).toMatchSnapshot();
  });
});
