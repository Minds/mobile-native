import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import ExplicitText from '../../../src/common/components/explicit/ExplicitText';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';

fdescribe('Explicit text component', () => {

  let user, comments, entity, screen;
  beforeEach(() => {

    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.mature = true;
    entity.mature_visibility = true;
    entity.decodeHTML = jest.fn();
    entity.toggleMatureVisibility = jest.fn();
    entity.decodeHTML.mockReturnValue('string');

    screen = shallow(
      <ExplicitText entity={entity}/>
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a TouchableOpacity', async () => {
    screen.update();

    expect(screen.find('TouchableOpacity')).toHaveLength(1);
  });


  it('change visibility', async () => {

    screen.update();

    screen.find('TouchableOpacity').simulate('press');
    screen.update();

    expect(entity.toggleMatureVisibility).toHaveBeenCalled();
  });
});
