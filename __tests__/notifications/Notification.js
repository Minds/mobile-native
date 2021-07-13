import 'react-native';
import React from 'react';

import { notificationsServiceFaker } from '../../__mocks__/fake/notifications/NotificationsFaker';
import NotificationModel from '../../src/notifications/v3/notification/NotificationModel';
import { shallow } from 'enzyme';
import Notification from '../../src/notifications/v3/notification/Notification';
import UserModel from '../../src/channel/UserModel';
import friendlyDateDiff from '../../src/common/helpers/friendlyDateDiff';

jest.mock('react-native-system-setting');
jest.mock('react-native-silent-switch');
jest.mock('../../src/common/helpers/friendlyDateDiff.ts');

jest.mock('../../src/common/services/session.service.ts');

jest.mock(
  '../../src/notifications/v3/notification/useNotificationRouter',
  () => () => ({
    navToEntity: jest.fn,
  }),
);

jest.mock('react-native-system-setting', () => {
  return {
    getVolume: jest.fn(() => Promise.resolve()),
  };
});

describe('Notifications component', () => {
  let notification;
  beforeEach(() => {
    friendlyDateDiff.mockReturnValue('1w');
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
