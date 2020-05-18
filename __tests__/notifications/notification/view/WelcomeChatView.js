import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import WelcomeChatView from '../../../../src/notifications/notification/view/WelcomeChatView';
import styles from '../../../../src/notifications/notification/style';

// fake data generation
import boostNotificationFactory from '../../../../__mocks__/fake/notifications/BoostNotificationFactory';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const entity = boostNotificationFactory('tag', 'comment');
  const notification = renderer
    .create(<WelcomeChatView styles={styles} entity={entity} />)
    .toJSON();

  expect(notification).toMatchSnapshot();
});
