import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import Message from './Message';
import sessionService from '~/common/services/session.service';

jest.mock('~/common/services/session.service');

const mockMessage = {
  id: '1',
  node: {
    guid: '123',
    plainText: 'Hello, World!',
    sender: {
      node: {
        guid: '123',
        username: 'testUser',
        name: 'testUser',
      },
    },
    timeCreatedUnix: '1616161616',
    timeCreatedISO8601: '2021-08-25T19:30:00Z',
  },
};

test('Message renders correctly for other users', () => {
  sessionService.getUser = jest.fn().mockReturnValue({ guid: '456' });

  // @ts-ignore
  render(<Message message={mockMessage} />);

  expect(screen.getByText('testUser')).toBeTruthy();
  expect(screen.getByText('Hello, World!')).toBeTruthy();
});

test('Message renders correctly for current user', () => {
  sessionService.getUser = jest.fn().mockReturnValue({ guid: '123' });
  // @ts-ignore
  render(<Message message={mockMessage} />);

  expect(screen.queryByText('testUser')).toBeNull();
  expect(screen.getByText('Hello, World!')).toBeTruthy();
});
