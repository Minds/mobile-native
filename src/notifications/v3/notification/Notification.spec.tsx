import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import UserModel from '../../../channel/UserModel';
import sessionService from '../../../common/services/session.service';
import NotificationItem from './Notification';
import NotificationModel, { NotificationType } from './NotificationModel';

jest.mock('../../../common/services/session.service');

const name = 'Fake user';

describe('Notification', () => {
  beforeEach(() => {
    sessionService.getUser = jest.fn().mockResolvedValue('');
  });

  test('Sender sends a Supermind offer', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.supermind_created,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(await screen.findByText(name)).toBeTruthy();
    expect(await screen.findByText('sent you a')).toBeTruthy();
    expect(await screen.findByText('Supermind offer')).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Receiver declines an offer', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.supermind_declined,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(await screen.findByText(name)).toBeTruthy();
    expect(await screen.findByText('has declined your')).toBeTruthy();
    expect(await screen.findByText('Supermind offer')).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Receiver accepts an offer', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.supermind_accepted,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(await screen.findByText(name)).toBeTruthy();
    expect(await screen.findByText('replied to your')).toBeTruthy();
    expect(await screen.findByText('Supermind offer')).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('24 hours before an offer expires', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.supermind_expired,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(await screen.findByText("Don't forget to review")).toBeTruthy();
    expect(await screen.findByText(` ${name}'s`, { exact: true })).toBeTruthy();
    expect(await screen.findByText('Supermind offer')).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('An offer expires', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.supermind_expire24h,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(await screen.findByText(name)).toBeTruthy();
    expect(await screen.findByText('missed your')).toBeTruthy();
    expect(await screen.findByText('Supermind offer')).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

const createFakeNotification = ({ type }: any) =>
  mapNotification({
    uuid: 'fakeUuid',
    to_guid: 'toGuid', // me
    from_guid: 'fromGuid',
    from: {
      guid: 'fakeGuid',
      type: 'user',
      name,
      username: 'fakeUsername',
    },
    read: false,
    created_timestamp: 1663685748,
    type,
    merged_from_guids: [],
    merged_from: [],
    merged_count: 0,
  });

const mapNotification = notification => {
  notification = NotificationModel.create(notification);
  if (notification.from) {
    notification.from = UserModel.create(notification.from);
  }
  if (notification.merged_from && notification.merged_from.length > 0) {
    notification.merged_from = UserModel.createMany(notification.merged_from);
  }
  return notification;
};
