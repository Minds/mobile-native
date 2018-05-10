import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';

import ActivityEditor from '../../../src/newsfeed/activity/ActivityEditor';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';



describe('Activity editor component', () => {

  let user, comments, entity, screen, newsfeed, toggleEdit;
  beforeEach(() => {
    newsfeed = { 
      list: {
        updateActivity: () => {
          return new Promise((r, rr) => {
            return value;
          });
        }
      } 
    }
  
    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    toggleEdit = jest.fn();
    screen = shallow(
      <ActivityEditor entity={activityResponse.activities[0]} toggleEdit={toggleEdit} navigation={navigation} newsfeed={newsfeed}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a Text input', async () => {
    screen.update();

    expect(screen.find('TextInput')).toHaveLength(1);
  });

  it('should set the default value when init, call toggle and submit',async () => {

    await screen.instance().componentWillMount();
    screen.update()
    let instance = screen.instance();
    expect(instance.state.text).toBe('Message');
    const spy = jest.spyOn(instance.props.newsfeed.list, 'updateActivity');
    const render = screen.dive();
    render.find('Button').at(1).props().onPress();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should set the default value when init, call toggle and cancel',async () => {

    await screen.instance().componentWillMount();
    screen.update()
    let instance = screen.instance();
    expect(instance.state.text).toBe('Message');
    const spy = jest.spyOn(instance.props, 'toggleEdit');
    const render = screen.dive();
    render.find('Button').at(0).props().onPress();
    expect(spy).toHaveBeenCalled();
  });



  it('should set the default value when init, call toggle and cancel',async () => {

    await screen.instance().componentWillMount();
    screen.update()
    let instance = screen.instance();
    expect(instance.state.text).toBe('Message');

    screen.find('TextInput').forEach(child => {
      child.simulate('changeText', 'data');
    });

    const spy = jest.spyOn(instance.props, 'toggleEdit');
    const render = screen.dive();
    render.find('Button').at(0).props().onPress();
    expect(spy).toHaveBeenCalled();
    expect(instance.state.text).toBe('data');
  });


});
