import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import Message from './Message';
import sessionService from '~/common/services/session.service';

jest.mock('~/common/services/session.service');

const mockMessage = {
  id: '1',
  sender: {
    guid: '123',
    username: 'testUser',
  },
  timeCreatedUnix: '1616161616',
  timeCreatedISO8601: '2021-08-25T19:30:00Z',
  plainText: 'Hello, World!',
};

test('Message renders correctly for other users', () => {
  sessionService.getUser = jest.fn().mockReturnValue({ guid: '456' });

  render(<Message message={mockMessage} />);

  expect(screen.getByText('testUser')).toBeTruthy();
  expect(screen.getByText('Hello, World!')).toBeTruthy();
});

test('Message renders correctly for current user', () => {
  sessionService.getUser = jest.fn().mockReturnValue({ guid: '123' });

  render(<Message message={mockMessage} />);

  expect(screen.queryByText('testUser')).toBeNull();
  expect(screen.getByText('Hello, World!')).toBeTruthy();
});
