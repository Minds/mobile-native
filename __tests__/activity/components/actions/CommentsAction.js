import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import CommentsAction from '../../../../src/newsfeed/activity/actions/CommentsAction';


describe('Comment action component', () => {

  let screen, navigatorStore, navigation;
  beforeEach(() => {

    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;
    navigation = { push: jest.fn(), state: {routeName: 'some'} };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <CommentsAction entity={activityResponse.activities[0]} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have a comment button', async () => {

    screen.update();

    expect(screen.find('PreventDoubleTap')).toHaveLength(1)
  });

  it('should navigate a thumb on press ', async () => {

    screen.update();
    let touchables = screen.find('PreventDoubleTap');
    touchables.at(0).props().onPress();
    expect(navigation.push).toHaveBeenCalled();
    expect(screen.find('PreventDoubleTap')).toHaveLength(1);

  });

});
