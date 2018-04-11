import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import DownvoteView from '../../../../src/notifications/notification/view/DownvoteView';
import styles from '../../../../src/notifications/notification/style';

// fake data generation
import boostNotificationFactory from '../../../../__mocks__/fake/notifications/BoostNotificationFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

/**
 * For activity
 */
it('renders correctly for activity', () => {

  const entity = boostNotificationFactory('downvote', 'activity');

  const notification = renderer.create(
    <DownvoteView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});

/**
 * For comment
 */
it('renders correctly for comment', () => {

  const entity = boostNotificationFactory('downvote', 'comment');

  const notification = renderer.create(
    <DownvoteView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});

/**
 * For object
 */
it('renders correctly for object', () => {

  const entity = boostNotificationFactory('downvote', 'object');

  const notification = renderer.create(
    <DownvoteView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});