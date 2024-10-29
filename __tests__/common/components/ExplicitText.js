import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import ExplicitText from '~/common/components/explicit/ExplicitText';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import renderer from 'react-test-renderer';
import ActivityModel from '~/newsfeed/ActivityModel';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

describe('Explicit text component', () => {
  let user, comments, entity, screen;

  it('renders correctly', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = ActivityModel.create(mockResponse.activities[0]);
    entity.mature = true;
    entity.mature_visibility = true;
    entity.decodeHTML = jest.fn();
    entity.shouldBeBlured = jest.fn();
    entity.toggleMatureVisibility = jest.fn();
    entity.decodeHTML.mockReturnValue('string');
    entity.shouldBeBlured.mockReturnValue(false);

    screen = shallow(<ExplicitText entity={entity} />);
    expect(screen).toMatchSnapshot();
  });
});
