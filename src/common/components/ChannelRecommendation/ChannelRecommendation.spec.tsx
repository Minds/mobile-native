import React from 'react';
import ChannelRecommendation from './ChannelRecommendation';

import { ChannelRecommendationItem } from './ChannelRecommendationBody';
import { shallow } from 'enzyme';
import UserModel from '~/channel/UserModel';

const mockEntity = {
  attachment_guid: false,
  blurb: false,
  custom_data: false,
  custom_type: false,
  rowKey: 'something',
  description: 'Congratulations! ',
  edited: '',
  guid: '',
  mature: false,
  time_created: '1522036284',
  ownerObj: {
    guid: '824853017709780997',
    type: 'user',
    subtype: false,
    time_created: '1522036284',
  },
  shouldBeBlured: jest.fn(),
  message: 'Message',
  title: 'TITLE',
  owner_guid: '824853017709780997',
  parent_guid: '838106762591510528',
  perma_url: false,
  thumbnail_src: false,
  type: 'activity',
  wire_totals: {
    tokens: 1000000000000000000,
  },
};

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
