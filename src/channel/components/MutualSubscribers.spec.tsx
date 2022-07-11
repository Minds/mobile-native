import React from 'react';
import { shallow } from 'enzyme';
import MutualSubscribers from './MutualSubscribers';

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
