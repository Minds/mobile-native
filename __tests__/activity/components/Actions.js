import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow, mount } from 'enzyme';

import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';

import Actions from '../../../src/newsfeed/activity/Actions';

import { commentsServiceFaker } from '../../../__mocks__/fake/CommentsFaker';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';

import formatDate from '../../../src/common/helpers/date';
import domain from '../../../src/common/helpers/domain';
import MediaView from '../../../src/common/components/MediaView';
import UserStore from '../../../src/auth/UserStore';
import MindsVideo from '../../../src/media/MindsVideo';
import MindsVideoV2 from '../../../src/media/v2/mindsVideo/MindsVideo';

import featuresService from '../../../src/common/services/features.service';
import { Provider } from 'mobx-react';

jest.mock('../../../src/media/MindsVideo', () => 'MindsVideo');
jest.mock('../../../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');
jest.mock(
  '../../../src/newsfeed/activity/actions/ThumbUpAction',
  () => 'ThumbUpAction',
);
jest.mock(
  '../../../src/newsfeed/activity/actions/WireAction',
  () => 'WireAction',
);
jest.mock(
  '../../../src/newsfeed/activity/actions/CommentsAction',
  () => 'CommentsAction',
);
jest.mock('../../../src/auth/UserStore');
jest.mock('../../../src/common/services/features.service');
jest.mock(
  '../../../src/newsfeed/activity/actions/RemindAction',
  () => 'RemindAction',
);
jest.mock(
  '../../../src/newsfeed/activity/actions/ThumbDownAction',
  () => 'ThumbDownAction',
);

xdescribe('Activity component', () => {
  let user, comments, entity, screen, activity;
  beforeEach(() => {
    featuresService.has.mockReturnValue(true);

    let activityResponse = activitiesServiceFaker().load(1);
    activity = activityResponse.activities[0];
    user = new UserStore();
    user.me = {
      guid: 'guidguid',
    };
    screen = shallow(
      <Provider user={user}>
        <Actions entity={activityResponse.activities[0]} />
      </Provider>,
    );
  });

  it('renders correctly', async () => {
    screen.update();
    const render = screen.dive();
    expect(render).toMatchSnapshot();
  });

  it('should have the expectedComponents', async () => {
    screen.update();

    // expect(screen.find('WireAction')).toHaveLength(1);
    expect(screen.find('ThumbUpAction')).toHaveLength(1);
    expect(screen.find('ThumbDownAction')).toHaveLength(1);
    expect(screen.find('CommentsAction')).toHaveLength(1);
    expect(screen.find('RemindAction')).toHaveLength(1);
  });

  it('should show hide elements accordingly to ownership (not owner)', () => {
    screen.update();
    let instance = screen.instance();

    expect(featuresService.has).toHaveBeenCalled();
  });

  it('should show hide elements accordingly to ownership (owner)', () => {
    featuresService.has.mockReturnValue(true);

    let activityResponse = activitiesServiceFaker().load(1);
    activity = activityResponse.activities[0];
    user = new UserStore();
    user.me = {
      guid: '824853017709780997',
    };
    screen = shallow(
      <Provider user={user}>
        <Actions entity={activityResponse.activities[0]} />
      </Provider>,
    );

    screen.update();
    expect(screen.find('BoostAction')).toHaveLength(1);
    expect(featuresService.has).toHaveBeenCalled();
  });

  it('should show hide elements accordingly to ownership (owner) but featureService gives false', () => {
    featuresService.has.mockReturnValue(false);

    let activityResponse = activitiesServiceFaker().load(1);
    activity = activityResponse.activities[0];
    user = new UserStore();
    user.me = {
      guid: '824853017709780997',
    };

    screen = shallow(
      <Provider user={user}>
        <Actions entity={activityResponse.activities[0]} />
      </Provider>,
    );

    screen.update();
    console.log(screen.debug());

    expect(screen.find('BoostAction')).toHaveLength(0);
    expect(featuresService.has).toHaveBeenCalled();
  });
});
