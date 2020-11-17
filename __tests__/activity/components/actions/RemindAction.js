import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';
import RemindAction from '../../../../src/newsfeed/activity/actions/RemindAction';
import ActivityModel from '../../../../src/newsfeed/ActivityModel';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getStores } from '../../../../AppStores';

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

  it('should have a remind button', async () => {
    expect(screen.find('Menu')).toHaveLength(1);
  });
});
