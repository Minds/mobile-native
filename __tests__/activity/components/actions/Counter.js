import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Counter from '~/newsfeed/activity/actions/Counter';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');

describe('Counter component', () => {
  let screen;
  beforeEach(() => {
    screen = renderer.create(<Counter count={100} />);
  });

  it('renders correctly', async () => {
    expect(screen).toMatchSnapshot();
  });

  it('should have Text', async () => {
    expect(screen.root.findAllByType('Text')).toHaveLength(1);
  });
});
