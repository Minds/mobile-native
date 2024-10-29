import 'react-native';
import React from 'react';
import { Text, Dimensions } from 'react-native';
import { shallow } from 'enzyme';
import MindsVideoV2 from '~/media/v2/mindsVideo/MindsVideo';
import MediaView from '~/common/components/MediaView';

import { activitiesServiceFaker } from '../../../__mocks__/fake/ActivitiesFaker';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

jest.mock('@gorhom/bottom-sheet');
jest.mock('~/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');

describe('Media view component', () => {
  let user, comments, entity, screen;
  beforeEach(() => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.custom_data = [{ height: 50, width: 20 }];
    entity.subtype = 'image';
    entity.getThumbSource = jest.fn();
    entity.getThumbSource.mockReturnValue({ uri: 'www.something.com' });
    entity.hasThumbnails = jest.fn();
    entity.hasThumbnails.mockReturnValue(false);
    entity.isGif = jest.fn();
    entity.isGif.mockReturnValue(false);
    screen = shallow(<MediaView entity={entity} />);
  });

  it('renders correctly', async () => {
    screen.update();
    expect(screen).toMatchSnapshot();
  });

  it('should have a MediaViewImage', async () => {
    screen.update();
    expect(screen.find('MediaViewImage')).toHaveLength(1);
  });

  it('should show overlay if press', async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.mature = false;
    entity.hasThumbnails = jest.fn();
    entity.hasThumbnails.mockReturnValue(false);
    screen = shallow(<MediaView entity={entity} />);
    screen.update();
    expect(screen.find('ExplicitOverlay')).toHaveLength(0);
  });

  it("shouldn't show overlay if press", async () => {
    let mockResponse = activitiesServiceFaker().load(1);
    entity = mockResponse.activities[0];
    entity.custom_data = [{ height: 50, width: 20 }];
    entity.subtype = 'videos';
    entity.getThumbSource = jest.fn();
    entity.getThumbSource.mockReturnValue({ uri: 'www.something.com' });
    entity.hasThumbnails = jest.fn();
    entity.hasThumbnails.mockReturnValue(false);
    screen = shallow(<MediaView entity={entity} />);
    screen.update();
    expect(screen.find('ExplicitOverlay')).toHaveLength(0);
  });
});
