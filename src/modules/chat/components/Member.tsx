import React from 'react';
import { Avatar, B2, Row } from '~/common/ui';
import { ChatMember } from '../types';

type Props = {
  member: ChatMember;
};

export default function Member({ member }: Props) {
  return (
    <Row vertical="S" align="centerStart">
      <Avatar
        size="tiny"
        source={{
          uri:
            member.node.iconUrl ??
            'https://cdn.minds.com/icon/773311697292107790/large/1597789367',
        }}
      />
      <B2 left="M" font="medium" top="S">
        {member.node.name}
      </B2>
    </Row>
  );
}
