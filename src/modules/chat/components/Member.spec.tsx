import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import Member from './Member';
import { ChatMember } from '../types';

const mockMember: ChatMember = {
  cursor: '',
  node: {
    guid: 'testGuid',
    name: 'testUser',
    username: 'testUser',
    id: '1',
    iconUrl: 'https://cdn.minds.com/icon/773311697292107790/large/1597789367',
  },
};

test('Member renders correctly', () => {
  render(<Member member={mockMember} />);

  expect(screen.getByText('testUser')).toBeTruthy();
});
