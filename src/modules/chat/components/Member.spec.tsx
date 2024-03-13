import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import Member from './Member';

const mockMember = {
  guid: '12345',
  username: 'testUser',
  avatar: 'https://cdn.minds.com/icon/100000000000000341/medium/1709275052',
};

test('Member renders correctly', () => {
  render(<Member member={mockMember} />);

  expect(screen.getByText('testUser')).toBeTruthy();
});
