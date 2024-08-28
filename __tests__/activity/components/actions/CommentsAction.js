import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import { activitiesServiceFaker } from '../../../../__mocks__/fake/ActivitiesFaker';
import CommentsAction from '~/newsfeed/activity/actions/CommentsAction';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
sp.mockService('styles');
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions = jest
  .fn()
  .mockImplementation(fn => fn());

describe('Comment action component', () => {
  let activityResponse;

  beforeEach(() => {
    activityResponse = activitiesServiceFaker().load(1);
  });

  it('renders correctly', () => {
    const { toJSON } = render(
      <CommentsAction entity={activityResponse.activities[0]} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a comment button', () => {
    render(
      <CommentsAction
        testID="comment-button"
        entity={activityResponse.activities[0]}
      />,
    );
    expect(screen.getByTestId('comment-button')).toBeTruthy();
  });

  it('should execute on press', async () => {
    const onPressComment = jest.fn();
    render(
      <CommentsAction
        testID="comment-button"
        entity={activityResponse.activities[0]}
        onPressComment={onPressComment}
      />,
    );

    await fireEvent.press(screen.getByTestId('comment-button'));
    expect(onPressComment).toHaveBeenCalled();
  });
});
