import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import CommentsAction from '../../../../src/newsfeed/activity/actions/CommentsAction';
import NavigationStore from '../../../../src/common/stores/NavigationStore';
import withPreventDoubleTap from '../../../../src/common/components/PreventDoubleTap';
import featuresService from '../../../../src/common/services/features.service';

jest.mock('../../../../src/common/stores/NavigationStore');

describe('Comment action component', () => {

  let screen, navigatorStore, navigation;
  beforeEach(() => {

    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;
    navigatorStore = new NavigationStore();
    navigatorStore.currentScreen = 'Something';
    navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);
    screen = shallow(
      <CommentsAction.wrappedComponent entity={activityResponse.activities[0]} navigatorStore={navigatorStore} navigation={navigation} />
    );

    jest.runAllTimers();
  });

  it('renders correctly', async () => {
    await screen.instance().componentWillMount();
    screen.update();
    expect(screen).toMatchSnapshot();
  });


  it('should have a comment button', async () => {

    await screen.instance().componentWillMount();
    screen.update();

    expect(screen.find('PreventDoubleTap')).toHaveLength(1)
  });

  it('should navigate a thumb on press ', async () => {

    await screen.instance().componentWillMount();
    screen.update();
    let render = screen.dive();
    let touchables = screen.find('PreventDoubleTap');
    touchables.at(0).props().onPress();
    expect(navigation.navigate).toHaveBeenCalled();
    expect(screen.find('PreventDoubleTap')).toHaveLength(1);

  });

});
