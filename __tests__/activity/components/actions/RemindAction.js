import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import RemindAction from '../../../../src/newsfeed/activity/actions/RemindAction';

import withPreventDoubleTap from '../../../../src/common/components/PreventDoubleTap';
import featuresService from '../../../../src/common/services/features.service';


describe('Thumb action component', () => {

  let screen;
  beforeEach(() => {

    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <RemindAction entity={activityResponse.activities[0]} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have a remind button', async () => {
    screen.update();
    expect(screen.find('PreventDoubleTap')).toHaveLength(1)
  });

  it('should navigate a thumb on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = { 
      navigate: jest.fn() 
    };
    let entity = activityResponse.activities[0];
    entity.toggleVote = jest.fn();
    entity.votedUp = true;
    screen = shallow(
      <RemindAction entity={entity} navigation={navigation}/>
    );
    screen.update()
    let touchables = screen.find('PreventDoubleTap');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(screen.instance().state.remindModalVisible).toBeTruthy();

  });

});