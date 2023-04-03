import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import ExplicitImage from '../../../src/common/components/explicit/ExplicitImage';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

import ActivityModel from '../../../src/newsfeed/ActivityModel';

jest.mock('../../../src/common/services/session.service');

describe('Explicit image component', () => {
  let entity, screen;

  it('renders correctly', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = ActivityModel.create(mockResponse.activities[0]);
    entity.getUser = jest.fn();
    entity.mature = true;

    screen = shallow(<ExplicitImage entity={entity} />);
    expect(screen).toMatchSnapshot();
  });
});
