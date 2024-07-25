import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import { notificationsServiceFaker } from '../../__mocks__/fake/notifications/NotificationsFaker';
import NotificationModel from '~/notifications/v3/notification/NotificationModel';
import Notification from '~/notifications/v3/notification/Notification';
import UserModel from '~/channel/UserModel';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('api');
const i18n = sp.mockService('i18n');
i18n.date = jest.fn();

jest.mock('react-native-system-setting');
jest.mock('../../ExperimentsProvider', () => ({
  hasVariation: jest.fn().mockResolvedValue(false),
}));

jest.mock(
  '~/notifications/v3/notification/useNotificationRouter',
  () => () => ({
    navToEntity: jest.fn,
  }),
);

describe('Notifications component', () => {
  let notification;
  beforeEach(() => {
    i18n.date.mockReturnValue('1w');
    let activityResponse = notificationsServiceFaker().load();
    const notif = activityResponse.notifications[0];
    notif.from = UserModel.create(notif.from);
    if (notif.merged_from && notif.merged_from.length > 0) {
      notif.merged_from = UserModel.createMany(notif.merged_from);
    }
    const model = NotificationModel.create(notif);
    notification = shallow(<Notification notification={model} />);
  });
  it('renders correctly', async () => {
    expect(notification).toMatchSnapshot();
  });
});
