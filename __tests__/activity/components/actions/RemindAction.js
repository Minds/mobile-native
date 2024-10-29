import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '~/../__mocks__/fake/ActivitiesFaker';
import RemindAction from '~/newsfeed/activity/actions/RemindAction';
import ActivityModel from '~/newsfeed/ActivityModel';
import { getStores } from '~/../AppStores';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');
sp.mockService('permissions');

jest.mock('~/../AppStores');
jest.mock('~/common/hooks/use-stores.tsx');

getStores.mockReturnValue({
  newsfeed: {},
});

describe('Thumb action component', () => {
  let screen, entity;

  beforeEach(() => {
    const navigation = { navigate: jest.fn(), state: { key: 1 } };
    let activityResponse = activitiesServiceFaker().load(1);

    entity = ActivityModel.create(activityResponse.activities[0]);

    screen = shallow(<RemindAction entity={entity} navigation={navigation} />);
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });
});
