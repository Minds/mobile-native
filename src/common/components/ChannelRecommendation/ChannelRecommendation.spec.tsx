import React from 'react';
import ChannelRecommendation, {
  ChannelRecommendationItem,
} from './ChannelRecommendation';
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
    suggestions: [
      {
        entity: mockEntity,
        guid: '',
      },
    ],
  },
}));

describe('ChannelRecommendation', () => {
  test('renders correctly', () => {
    const component = shallow(<ChannelRecommendation />);

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
