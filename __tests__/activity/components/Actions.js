import 'react-native';
import React from 'react';
import { shallow, mount } from 'enzyme';
import Actions from '../../../src/newsfeed/activity/Actions';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import UserStore from '../../../src/auth/UserStore';

import { Provider } from 'mobx-react';

jest.mock('../../../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');
jest.mock(
  '../../../src/newsfeed/activity/actions/ThumbAction',
  () => 'ThumbAction',
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
jest.mock(
  '../../../src/newsfeed/activity/actions/RemindAction',
  () => 'RemindAction',
);
jest.mock('~/common/services/analytics.service');

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
    expect(screen.find('ThumbAction')).toHaveLength(2);
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
