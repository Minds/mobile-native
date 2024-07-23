import { shallow } from 'enzyme';
import React from 'react';
import 'react-native';
import { TouchableOpacity } from 'react-native';
import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';
import ActivityModel from '../../../../src/newsfeed/ActivityModel';
import ThumbUpAction from '../../../../src/newsfeed/activity/actions/ThumbAction';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
const permissions = sp.mockService('permissions');
sp.mockService('analytics');

jest.mock('../../../../src/auth/UserStore');

describe('Thumb action component', () => {
  let screen, entity;
  beforeEach(() => {
    const TouchableOpacityCustom = <TouchableOpacity onPress={this.onPress} />;

    permissions.canInteract.mockReturnValue(true);

    const navigation = { navigate: jest.fn() };
    let activityResponse = activitiesServiceFaker().load(1);

    entity = ActivityModel.create(activityResponse.activities[0]);
    entity.can = jest.fn(() => true);

    screen = shallow(
      <ThumbUpAction direction="up" entity={entity} navigation={navigation} />,
    );
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have an action button', async () => {
    screen.update();
    expect(screen.find('AnimatedThumb')).toHaveLength(1);
  });

  it('should navigate a thumb on press ', () => {
    const navigation = {
      navigate: jest.fn(),
    };

    entity.toggleVote = jest.fn().mockResolvedValue(true);

    screen = shallow(
      <ThumbUpAction direction="up" entity={entity} navigation={navigation} />,
    );
    screen.update();
    let touchables = screen.find('preventDoubleTap(PressableScale)');
    touchables.at(0).props().onPress();

    expect(entity.toggleVote).toHaveBeenCalled();

    expect(touchables).toHaveLength(1);
  });
});
