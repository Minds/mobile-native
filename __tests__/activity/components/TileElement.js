import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import TileElement from '../../../src/newsfeed/TileElement';

describe('Owner component', () => {

  let screen;
  beforeEach(() => {

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    let entity = activityResponse.activities[0];
    entity.getThumbSource = jest.fn();
    screen = shallow(
      <TileElement entity={entity} navigation={navigation} size={30}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have Touchableopacity', async () => {
    screen.update();
    expect(screen.find(TouchableOpacity)).toHaveLength(1);
  });

  it('should _navToChannel on press ', () => {
    const navigation = { 
      navigate: jest.fn() 
    };
    let activityResponse = activitiesServiceFaker().load(1);
    let entity = activityResponse.activities[0];
    entity.getThumbSource = jest.fn();
    screen = shallow(
      <TileElement entity={entity} navigation={navigation} size={30}/>
    );
    screen.update();
    let touchables = screen.find('TouchableOpacity');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(navigation.navigate).toHaveBeenCalledWith('Activity', {"entity": entity });

  });

});
