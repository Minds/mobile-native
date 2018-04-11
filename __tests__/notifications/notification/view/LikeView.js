import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import LikeView from '../../../../src/notifications/notification/view/LikeView';
import styles from '../../../../src/notifications/notification/style';

// fake data generation
import boostNotificationFactory from '../../../../__mocks__/fake/notifications/BoostNotificationFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

/**
 * For activity
 */
it('renders correctly for activity', () => {

  const entity = boostNotificationFactory('like', 'activity');

  const notification = renderer.create(
    <LikeView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});

/**
 * For comment
 */
it('renders correctly for comment', () => {

  const entity = boostNotificationFactory('like', 'comment');

  const notification = renderer.create(
    <LikeView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});

/**
 * For object
 */
it('renders correctly for object', () => {

  const entity = boostNotificationFactory('like', 'object');

  const notification = renderer.create(
    <LikeView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});