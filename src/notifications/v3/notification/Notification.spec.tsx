import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import UserModel from '../../../channel/UserModel';
import sessionService from '../../../common/services/session.service';
import NotificationItem from './Notification';
import NotificationModel, { NotificationType } from './NotificationModel';
import { hasVariation } from '../../../../ExperimentsProvider';

jest.mock('../../../common/services/session.service');

jest.mock('../../../../ExperimentsProvider');

const mockedHasVariation = hasVariation as jest.Mock<boolean>;

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
    expect(await screen.findByText(/sent you a/)).toBeTruthy();
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
    expect(await screen.findByText(/has declined your/)).toBeTruthy();
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
    expect(await screen.findByText(/replied to your/)).toBeTruthy();
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
    expect(await screen.findByText(/Don\'t forget to review/)).toBeTruthy();
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
    expect(await screen.findByText(/missed your/)).toBeTruthy();
    expect(await screen.findByText('Supermind offer')).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Boost accepted', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.boost_accepted,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(
      await screen.findByText('Your Boost is now running', { exact: true }),
    ).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Boost complete', async () => {
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.boost_completed,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(
      await screen.findByText('Your Boost is complete', { exact: true }),
    ).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Boost rejected', async () => {
    mockedHasVariation.mockReturnValue(true);
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.boost_rejected,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(
      await screen.findByText(/Your Boost was rejected/, { exact: true }),
    ).toBeTruthy();

    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Boost rejected legacy', async () => {
    mockedHasVariation.mockReturnValue(false);
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.boost_rejected,
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(await screen.findByText(name)).toBeTruthy();
    expect(
      await screen.findByText(/is unable to approve your/, { exact: true }),
    ).toBeTruthy();
    expect(await screen.findByText('boost', { exact: true })).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Affiliate earnings deposited', async () => {
    mockedHasVariation.mockReturnValue(false);
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.affiliate_earnings_deposited,
          data: {
            amount_usd: 10.99,
          },
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(
      await screen.findByText(
        /You just earned \$10.99 from Minds Affiliate Program/,
        { exact: true },
      ),
    ).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Referrer affiliate earnings deposited', async () => {
    mockedHasVariation.mockReturnValue(false);
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.referrer_affiliate_earnings_deposited,
          data: {
            amount_usd: 12.99,
          },
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(
      await screen.findByText(
        /You just earned \$12.99 from Minds Affiliate Program/,
        { exact: true },
      ),
    ).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

const createFakeNotification = ({ type, ...rest }: any) =>
  mapNotification({
    uuid: 'fakeUuid',
    to_guid: 'toGuid', // me
    from_guid: 'fromGuid',
    entity: {
      guid: '1421555700533825546',
      activity_guid: '1421555700693209108',
      reply_activity_guid: null,
      sender_guid: '1413830564946907152',
      receiver_guid: '991441275603390467',
      status: 4,
      payment_amount: 10,
      payment_method: 1,
      payment_txid: null,
      created_timestamp: 1664301290,
      expiry_threshold: 604800,
      updated_timestamp: 1664301294,
      twitter_required: false,
      reply_type: 0,
      entity: null,
      receiver_entity: null,
    },
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
    ...rest,
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
