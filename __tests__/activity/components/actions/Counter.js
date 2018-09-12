import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import Counter from '../../../../src/newsfeed/activity/actions/Counter';

describe('Owner component', () => {

  let screen;
  beforeEach(() => {

    const navigation = { navigate: jest.fn() };
    screen = renderer.create(
      <Counter count={100} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {

    expect(screen).toMatchSnapshot();
  });


  it('should have Text', async () => {
    expect(screen.root.findAllByType('Text')).toHaveLength(1);
  });

  it('should _navToChannel on press ', () => {
    let touchables = screen.root.findAllByType('Text');
    expect(touchables[0].props['children']).toBe(100);
  });

});
