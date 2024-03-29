import 'react-native';
import React from 'react';

import { notificationsServiceFaker } from '../../__mocks__/fake/notifications/NotificationsFaker';
import NotificationModel from '../../src/notifications/v3/notification/NotificationModel';
import { shallow } from 'enzyme';
import Notification from '../../src/notifications/v3/notification/Notification';
import UserModel from '../../src/channel/UserModel';
import i18n from '../../src/common/services/i18n.service.ts';

jest.mock('react-native-system-setting');
jest.mock('../../src/common/services/session.service.ts');
jest.mock('../../src/common/services/i18n.service.ts');
jest.mock('../../ExperimentsProvider', () => ({
  hasVariation: jest.fn().mockResolvedValue(false),
}));

jest.mock(
  '../../src/notifications/v3/notification/useNotificationRouter',
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
