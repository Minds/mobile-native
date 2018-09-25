import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import Poster from '../../src/newsfeed/Poster';
import UserStore from '../../src/auth/UserStore';

import {
  FlatList,
  KeyboardAvoidingView
} from 'react-native';


jest.mock('../../src/auth/UserStore');

import * as dependency from '../../src/newsfeed/NewsfeedService';

fdescribe('Newsfeed poster component', () => {

  let user, screen;
  beforeEach(() => {
    user = new UserStore();
    screen = shallow(
      <Poster.wrappedComponent user={user} guid='guid1' isRemind={false}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have a TextInput', async () => {

    expect(screen.find('TextInput')).toHaveLength(1);
  });

  it('should have a poster button', async () => {

    expect(screen.find('TouchableHighlight')).toHaveLength(1);
  });

  it('should calls post on posting', async () => {

    const spy = jest.spyOn(dependency, 'post');

    const render = screen.dive();
    screen.find('TextInput').forEach(child => {
      child.simulate('changeText', 'data');
    });

    await screen.find('TouchableHighlight').at(0).simulate('press');

    expect(screen.instance().state.text).toEqual('data');

    expect(spy).toBeCalled();
  });

  it('should calls remind on posting a remind', async () => {

    user = new UserStore();
    screen = shallow(
      <Poster.wrappedComponent user={user} guid='guid1' isRemind={true}/>
    );

    jest.runAllTimers();

    const spy = jest.spyOn(dependency, 'remind');

    const render = screen.dive();
    screen.find('TextInput').forEach(child => {
      child.simulate('changeText', 'data');
    });

    await screen.find('Icon').at(0).simulate('press');

    expect(screen.instance().state.text).toEqual('data');

    expect(spy).toBeCalled();
  });

});
