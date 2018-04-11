import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import BoostCompletedView from '../../../../src/notifications/notification/view/BoostCompletedView';
import styles from '../../../../src/notifications/notification/style';

// fake data generation
import boostNotificationFactory from '../../../../__mocks__/fake/notifications/BoostNotificationFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {

  const entity = boostNotificationFactory('boost_completed');

  const notification = renderer.create(
    <BoostCompletedView styles={styles} entity={entity}/>
  ).toJSON();

  expect(notification).toMatchSnapshot();
});