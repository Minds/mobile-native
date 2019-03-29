import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import OwnerBlock from '../../../src/newsfeed/activity/OwnerBlock';
import withPreventDoubleTap from '../../../src/common/components/PreventDoubleTap';

// const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);
describe('Owner component', () => {
  
  let screen;
  beforeEach(() => {
    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;

    const navigation = { navigate: jest.fn(), push: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <OwnerBlock entity ={activityResponse.activities[0]} navigation={navigation} rightToolbar={null}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have PreventDoubleTap', async () => {
    screen.update();
    expect(screen.find('PreventDoubleTap')).toHaveLength(2);
  });

  it('should _navToChannel on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = {
      navigate: jest.fn(),
      push: jest.fn()
    };

    let entity = activityResponse.activities[0];
    entity.containerObj = { guid: 'guidguid' };
    screen = shallow(
      <OwnerBlock entity={entity} navigation={navigation} rightToolbar={null}/>
    );
    screen.update()
    let touchables = screen.find('PreventDoubleTap');
    touchables.at(0).props().onPress();
    jest.runAllTimers();

    expect(navigation.push).toHaveBeenCalledWith('Channel', {'entity': entity.ownerObj, 'guid': entity.ownerObj.guid});


    expect(screen.find('PreventDoubleTap')).toHaveLength(3);

  });


  it('should nav to groups on press ', () => {
    let activityResponse = activitiesServiceFaker().load(1);

    const navigation = {
      navigate: jest.fn(),
      push: jest.fn()
    };
    let entity = activityResponse.activities[0];
    entity.containerObj = { guid: 'guidguid' };
    screen = shallow(
      <OwnerBlock entity={entity} navigation={navigation} rightToolbar={null}/>
    );
    screen.update()
    let touchables = screen.find('PreventDoubleTap');

    expect(screen.find('PreventDoubleTap')).toHaveLength(3);
    //group touchable
    touchables.at(2).props().onPress();
    jest.runAllTimers();

    expect(navigation.push).toHaveBeenCalled();

  });


});
