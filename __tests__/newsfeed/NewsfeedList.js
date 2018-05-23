import 'react-native';
import React from 'react';
//import { Platform, CameraRoll, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import NewsfeedList from '../../src/newsfeed/NewsfeedList';
import { activitiesServiceFaker } from '../../__mocks__/fake/ActivitiesFaker';
import renderer from 'react-test-renderer';

import UserStore from '../../src/auth/UserStore';

import TileElement from '../../src/newsfeed/TileElement';
import Activity from '../../src/newsfeed/activity/Activity';
import UserModel from '../../src/channel/UserModel';
import ActivityModel from '../../src/newsfeed/ActivityModel';
jest.mock('../../src/channel/UserModel');
jest.mock('../../src/newsfeed/ActivityModel');
jest.mock('../../src/newsfeed/activity/Activity', () => 'Activity');
jest.mock('../../src/newsfeed/TileElement', () => 'TileElement');
jest.mock('../../src/auth/UserStore');

/**
 * Tests
 */
describe('newsfeed list screen component', () => {

  let store, entities, activityResponse, user;

  beforeEach(() => {
    activityResponse = activitiesServiceFaker().load(5);
    entities = activityResponse.activities;
    user = new UserStore();
    store = {
      refreshing: false,
      loadFeed: jest.fn()
    };
    store.list = {
      refreshing: false,
    };
    store.list.entities = entities;
    store.list.loaded = true;
    screen = shallow(
      <NewsfeedList.wrappedComponent newsfeed={store} user={user} />
    );

    screen.update();
  });

  it('should renders correctly', () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have n tileelements', async () => {

    activityResponse = activitiesServiceFaker().load(5);
    entities = activityResponse.activities;
    store.list = {
      refreshing: false,
    };
    store.list.entities = entities;
    store.list.loaded = true;
    store.isTiled = true;

    const testRenderer = renderer.create(
      <NewsfeedList.wrappedComponent  newsfeed={store} user={user}/>
    );
    let test = testRenderer.root;

    expect(test.findAllByType('Activity').length).toBe(0);

    expect(test.findAllByType('TileElement').length).toBe(5);

  });


  it('should have n activities', async () => {

    activityResponse = activitiesServiceFaker().load(5);
    entities = activityResponse.activities;
    store.list = {
      refreshing: false,
    };
    store.list.entities = entities;
    store.list.loaded = true;
    store.isTiled = false;

    const testRenderer = renderer.create(
      <NewsfeedList.wrappedComponent  newsfeed={store} user={user}/>
    );
    let test = testRenderer.root;

    expect(test.findAllByType('Activity').length).toBe(5);

    expect(test.findAllByType('TileElement').length).toBe(0);

  });

  
});