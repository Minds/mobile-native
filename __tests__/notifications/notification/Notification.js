import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import Notification from '../../../src/notifications/notification/Notification';

// fake data generation
import boostNotificationFactory from '../../../__mocks__/fake/notifications/BoostNotificationFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const types = [
  'boost_accepted',
  'boost_completed',
  'boost_gift',
  'boost_peer_accepted',
  'boost_peer_rejected',
  'boost_peer_request',
  'boost_rejected',
  'boost_revoked',
  'boost_submitted_p2p',
  'boost_submitted',
  'comment',
  'custom_message',
  'downvote',
  'feature',
  'friends',
  'group_activity',
  'group_invite',
  'group_kick',
  'like',
  'missed_call',
  'remind',
  'tag',
  'welcome_boost',
  'welcome_chat',
  'welcome_discover',
  'welcome_points',
  'welcome_post',
  'wire_happened'
];

/**
 * Tests
 */
describe('notification component', () => {

  it('renders correctly for every type', () => {

    types.forEach(type => {
      const entity = boostNotificationFactory(type);

      const notification = renderer.create(
        <Notification entity={entity}/>
      ).toJSON();

      expect(notification).toMatchSnapshot();
    });
  });

});