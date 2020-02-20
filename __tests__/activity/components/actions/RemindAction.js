import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';
import RemindAction from '../../../../src/newsfeed/activity/actions/RemindAction';
import ActivityModel from '../../../../src/newsfeed/ActivityModel';
import { useRoute, useNavigation } from '@react-navigation/native';


describe('Thumb action component', () => {
  let screen, entity;

  beforeEach(() => {
    const navigation = { push: jest.fn(), state: { key: 1 } };
    let activityResponse = activitiesServiceFaker().load(1);

    entity = ActivityModel.create(activityResponse.activities[0]);

    screen = shallow(<RemindAction entity={entity} navigation={navigation} />);
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have a remind button', async () => {
    expect(screen.find('PreventDoubleTap')).toHaveLength(1);
  });

  it('should navigate a thumb on press ', () => {
    const navigation = {
      push: jest.fn(),
    };

    useRoute.mockReturnValue({ key: 1 });
    useNavigation.mockReturnValue(navigation);

    entity.toggleVote = jest.fn();
    entity['thumbs:up:user_guids'] = ['1'];


    screen = shallow(
      <RemindAction entity={entity} navigation={navigation} />,
    );
    screen.update();
    let touchables = screen.find('PreventDoubleTap');
    touchables
      .at(0)
      .props()
      .onPress();

    expect(navigation.push).toBeCalled();
  });
});
