import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Counter from '../../../../src/newsfeed/activity/actions/Counter';

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
