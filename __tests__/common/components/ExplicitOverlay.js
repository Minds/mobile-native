import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ExplicitOverlay from '~/common/components/explicit/ExplicitOverlay';
import ActivityModel from '~/newsfeed/ActivityModel';
import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
sp.mockService('i18n');

describe('Explicit overlay component', () => {
  let entity, screen;
  beforeEach(() => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = ActivityModel.create(mockResponse.activities[0]);
    entity.mature_visibility = false;
    screen = shallow(<ExplicitOverlay entity={entity} />);
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should renders the etag', async () => {
    entity.mature_visibility = true;
    await screen.update();

    expect(screen).toMatchSnapshot();
  });
});
