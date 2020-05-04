import 'react-native';
import React from 'react';
import { Text, Dimensions, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import MediaView from '../../../src/common/components/MediaView';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';

describe('Media view component', () => {
  let user, comments, entity, screen;
  beforeEach(() => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.custom_data = [{ height: 50, width: 20 }];
    entity.subtype = 'image';
    entity.getThumbSource = jest.fn();
    entity.getThumbSource.mockReturnValue({ uri: 'www.something.com' });
    screen = shallow(<MediaView entity={entity} />);
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a TouchableOpacity', async () => {
    screen.update();
    expect(screen.find('ExplicitImage')).toHaveLength(1);
    expect(screen.find('TouchableOpacity')).toHaveLength(1);
  });

  it('sholdnt show overlay if press', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.mature = false;
    screen = shallow(<MediaView entity={entity} />);
    screen.update();
    expect(screen.find('ExplicitOverlay')).toHaveLength(0);
  });

  it('sholdnt show overlay if press', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.custom_data = [{ height: 50, width: 20 }];
    entity.subtype = 'videos';
    entity.getThumbSource = jest.fn();
    entity.getThumbSource.mockReturnValue({ uri: 'www.something.com' });
    screen = shallow(<MediaView entity={entity} />);
    screen.update();
    expect(screen.find('ExplicitOverlay')).toHaveLength(0);
  });
});
