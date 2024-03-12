import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import MessageList from './MessageList';
import sessionService from '~/common/services/session.service';

const mockMessages = [
  {
    id: '1',
    sender: {
      guid: '123',
      username: 'testUser',
    },
    timeCreatedUnix: '1616161616',
    timeCreatedISO8601: '2021-08-25T19:30:00Z',
    plainText: 'Hello, World!',
  },
  {
    id: '2',
    sender: {
      guid: '456',
      username: 'anotherUser',
    },
    timeCreatedUnix: '1616161617',
    timeCreatedISO8601: '2021-08-25T19:31:00Z',
    plainText: 'Hello, again!',
  },
];

jest.mock('~/common/services/session.service');

describe('MessageList', () => {
  it('should render a list of Message components', () => {
    sessionService.getUser = jest.fn().mockReturnValue({ guid: '456' });
    render(<MessageList data={mockMessages} />);

    mockMessages.forEach(message => {
      expect(screen.getByText(message.plainText)).toBeTruthy();
    });
  });

  it('should render correctly', () => {
    sessionService.getUser = jest.fn().mockReturnValue({ guid: '456' });
    render(<MessageList data={mockMessages} />);
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
