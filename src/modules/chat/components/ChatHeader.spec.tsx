import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ChatHeader from './ChatHeader';

describe('ChatHeader', () => {
  const members = [
    {
      node: {
        iconUrl: 'url1',
        name: 'John',
        username: 'u1',
        guid: '1',
        id: '1',
      },
      cursor: '',
    },
    {
      node: {
        iconUrl: 'url2',
        name: 'Martin',
        username: 'u2',
        guid: '2',
        id: '2',
      },
      cursor: '',
    },
    {
      node: {
        iconUrl: 'url3',
        name: 'Ben',
        username: 'u3',
        guid: '3',
        id: '3',
      },
      cursor: '',
    },
  ];

  it('renders the title with the first three members', () => {
    render(<ChatHeader members={members} extra={null} />);

    const title = screen.getByText('John, Martin, Ben');
    expect(title).toBeTruthy();
  });

  it('renders the Avatar component for each member', () => {
    render(<ChatHeader members={members} />);

    const avatarComponents = screen.getAllByTestId('Avatar');
    expect(avatarComponents.length).toBe(members.length);
  });

  it('passes the correct source to the Avatar component', () => {
    render(<ChatHeader members={members} />);

    const avatarComponents = screen.getAllByTestId('Avatar');
    avatarComponents.forEach((avatarComponent, index) => {
      expect(avatarComponent.props.source.uri).toBe(
        members[index].node.iconUrl,
      );
    });
  });
});
