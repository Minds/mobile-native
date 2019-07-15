import 'react-native';
import React from 'react';

import { shallow } from 'enzyme';

import ActivityEditor from '../../../src/newsfeed/activity/ActivityEditor';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import ActivityModel from '../../../src/newsfeed/ActivityModel';



describe('Activity editor component', () => {

  let user, comments, entity, screen, newsfeed, toggleEdit, activity;
  beforeEach(() => {
    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    activity = new ActivityModel(activityResponse.activities[0])
    toggleEdit = jest.fn();
    screen = shallow(
      <ActivityEditor entity={activity} toggleEdit={toggleEdit} navigation={navigation} newsfeed={newsfeed}/>
    );

    //jest.runAllTimers();
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

    screen.update()
    let instance = screen.instance();
    expect(instance.state.text).toBe('Message');
    const spy = jest.spyOn(activity, 'updateActivity');
    screen.find('Button').at(1).props().onPress();

    expect(spy).toHaveBeenCalled();
  });

  it('should set the default value when init, call toggle and cancel',async () => {

    screen.update()
    let instance = screen.instance();
    expect(instance.state.text).toBe('Message');
    const spy = jest.spyOn(instance.props, 'toggleEdit');
    screen.find('Button').at(0).props().onPress();
    expect(spy).toHaveBeenCalled();
  });



  it('should set the default value when init, call toggle and cancel',async () => {

    screen.update()
    let instance = screen.instance();
    expect(instance.state.text).toBe('Message');

    screen.find('TextInput').forEach(child => {
      child.simulate('changeText', 'data');
    });

    const spy = jest.spyOn(instance.props, 'toggleEdit');
    screen.find('Button').at(0).props().onPress();
    expect(spy).toHaveBeenCalled();
    expect(instance.state.text).toBe('data');
  });


});
