import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import sp from '~/services/serviceProvider';
import UserModel from '~/channel/UserModel';
import NotificationItem from './Notification';
import NotificationModel, { NotificationType } from './NotificationModel';
import { hasVariation } from '~/../ExperimentsProvider';
import { fakeOne } from '__mocks__/fake/ActivitiesFaker';

jest.mock('~/services/serviceProvider');

jest.mock('~/../ExperimentsProvider');

sp.mockService('i18n');
sp.mockService('api');
sp.mockService('analytics');
sp.mockService('translation');
const sessionService = sp.mockService('session');

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

  test('Gift boost created', async () => {
    mockedHasVariation.mockReturnValue(false);
    render(
      <NotificationItem
        notification={createFakeNotification({
          type: NotificationType.gift_card_recipient_notified,
          data: {
            sender: {
              guid: '1508488626269327366',
              type: 'user',
              subtype: false,
              time_created: '1685027714',
              time_updated: false,
              container_guid: '0',
              owner_guid: '0',
              site_guid: false,
              access_id: '2',
              tags: [],
              nsfw: [],
              nsfw_lock: [],
              name: 'Test User',
              username: 'test_user',
              language: 'en',
              icontime: '0',
              legacy_guid: false,
              featured_id: false,
              banned: 'no',
              ban_reason: false,
              website: false,
              briefdescription: '',
              gender: false,
              city: false,
              merchant: false,
              boostProPlus: false,
              fb: false,
              mature: 0,
              monetized: false,
              signup_method: false,
              social_profiles: [],
              feature_flags: false,
              programs: [],
              plus: false,
              hashtags: false,
              verified: false,
              founder: false,
              disabled_boost: false,
              boost_autorotate: true,
              categories: [],
              wire_rewards: null,
              pinned_posts: [],
              is_mature: false,
              mature_lock: false,
              last_accepted_tos: 1,
              opted_in_hashtags: 0,
              last_avatar_upload: '0',
              canary: false,
              theme: 'dark',
              toaster_notifications: true,
              mode: 0,
              btc_address: '',
              surge_token: '',
              hide_share_buttons: false,
              allow_unsubscribed_contact: false,
              dismissed_widgets: ['supermind-onboarding-modal-reply'],
              liquidity_spot_opt_out: 0,
              supermind_settings: {
                min_offchain_tokens: 1,
                min_cash: 1,
              },
              'thumbs:up:count': '0',
              'thumbs:down:count': '0',
              'thumbs:up:user_guids': [],
              'thumbs:down:user_guids': [],
              did: 'did:web::test_user',
              urn: 'urn:user:1508488626269327366',
              boost_rating: 1,
              pro: false,
              pro_published: false,
              rewards: false,
              p2p_media_enabled: false,
              is_admin: false,
              onchain_booster: 0,
              email_confirmed: true,
              eth_wallet: '',
              rating: 1,
              disable_autoplay_videos: false,
              yt_channels: [],
            },
            gift_card: {
              guid: 1522968400026931200,
              productId: 0,
              amount: 2.5,
              issuedByGuid: 1508488626269327400,
              issuedAt: 1688479961,
              claimCode:
                '92ea48a8957e1208b7dffcbfc1253915e3f815bf9fb70641354463193b0dd056',
              expiresAt: 1720102361,
              claimedByGuid: null,
              claimedAt: null,
              balance: 2.5,
            },
          },
        })}
        onShowSubscribers={jest.fn()}
      />,
    );
    expect(
      await screen.findByText(/sent you a gift for Boost/, { exact: true }),
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
      entity: type.startsWith('boost') ? fakeOne(null) : null,
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
