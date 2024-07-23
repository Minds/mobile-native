import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import CommentsAction from '~/newsfeed/activity/actions/CommentsAction';
import IconButtonNext from '~/common/ui/icons';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

describe('Comment action component', () => {
  let screen, navigatorStore, navigation;
  beforeEach(() => {
    navigation = {
      push: jest.fn(),
      state: { routeName: 'some' },
      dangerouslyGetState: jest.fn(),
    };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <CommentsAction
        entity={activityResponse.activities[0]}
        navigation={navigation}
      />,
    );

    //jest.runAllTimers();
  });

  it('renders correctly', () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a comment button', () => {
    screen.update();

    expect(screen.find('withSpacer(IconButtonNextComponent)')).toHaveLength(1);
  });

  it('should navigate a thumb on press ', () => {
    navigation.dangerouslyGetState.mockReturnValue({ routes: null });

    screen.update();
    let touchables = screen.find('withSpacer(IconButtonNextComponent)');
    touchables.at(0).props().onPress();
    expect(navigation.push).toHaveBeenCalled();
    expect(screen.find('withSpacer(IconButtonNextComponent)')).toHaveLength(1);
  });
});
