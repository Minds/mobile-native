import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import CommentsAction from '../../../../src/newsfeed/activity/actions/CommentsAction';

describe('Comment action component', () => {
  let screen, navigatorStore, navigation;
  beforeEach(() => {
    navigation = {
      push: jest.fn(),
      state: { routeName: 'some' },
      dangerouslyGetState: jest.fn(),
    };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <CommentsAction
        entity={activityResponse.activities[0]}
        navigation={navigation}
      />,
    );

    //jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a comment button', async () => {
    screen.update();

    expect(screen.find('preventDoubleTap(TouchableOpacity)')).toHaveLength(1);
  });

  it('should navigate a thumb on press ', async () => {
    navigation.dangerouslyGetState.mockReturnValue({ routes: null });

    screen.update();
    let touchables = screen.find('preventDoubleTap(TouchableOpacity)');
    touchables.at(0).props().onPress();
    expect(navigation.push).toHaveBeenCalled();
    expect(screen.find('preventDoubleTap(TouchableOpacity)')).toHaveLength(1);
  });
});
