import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import TagView from '../../../../src/notifications/notification/view/TagView';
import styles from '../../../../src/notifications/notification/style';

// fake data generation
import boostNotificationFactory from '../../../../__mocks__/fake/notifications/BoostNotificationFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

/**
 * For comment
 */
it('renders correctly comment', () => {

  const entity = boostNotificationFactory('tag', 'comment');

  const notification = renderer.create(
    <TagView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});

/**
 * For activity
 */
it('renders correctly activity', () => {

  const entity = boostNotificationFactory('tag', 'activity');

  const notification = renderer.create(
    <TagView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});