import React, { useState } from 'react';
import { View } from 'react-native';
import Link from '~/common/components/Link';
import Toggle from '~/common/components/Toggle';
import { B1, H3, IconButton, Row, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import Member from '../components/Member';
import sessionService from '~/common/services/session.service';

export default function ChatDetailsScreen({ route }) {
  const myGuid = sessionService.getUser().guid;
  const members = (route.params?.members ?? []).filter(m => m.guid !== myGuid);

  const [collapsed, setCollapsed] = useState(true);
  const [mute, setMute] = useState(false);

  const deleteChat = () => {
    console.log('delete chat');
  };
  const leaveChat = () => {
    console.log('leave chat');
  };

  const reportUser = () => {
    console.log('report user', members[0].username);
  };
  const blockUser = () => {
    console.log('block user', members[0].username);
  };

  const privateChat = (members?.length ?? 0) === 1;
  const myChat = true;
  return (
    <Screen safe scroll>
      <ScreenHeader border back={true} title="Chat details" />
      <H3 left="XXXL" top="XXXL">
        Notifications
      </H3>
      <Row align="centerBetween" vertical="XL" horizontal="XXXL">
        <B1>Mute notifications for this chat</B1>
        <Toggle value={mute} onValueChange={setMute} />
      </Row>
      <Row align="centerBetween" vertical="XL" horizontal="XXXL">
        <H3>Chat Members ({members?.length})</H3>
        <IconButton
          name={collapsed ? 'chevron-right' : 'chevron-down'}
          size={32}
          onPress={() => setCollapsed(prev => !prev)}
        />
      </Row>
      <View style={styles.separator} />
      <View style={[styles.container, collapsed && { display: 'none' }]}>
        {members.map(member => (
          <Member key={member.guid} member={member} />
        ))}
      </View>
      <View style={styles.separator} />
      {privateChat && (
        <>
          <Link
            style={styles.simpleLink}
            decoration={false}
            onPress={reportUser}>
            Report user
          </Link>
          <Link
            style={styles.dangerLink}
            decoration={false}
            onPress={blockUser}>
            Block user
          </Link>
        </>
      )}
      <Link style={styles.dangerLink} decoration={false} onPress={leaveChat}>
        Leave chat
      </Link>
      {myChat && (
        <Link style={styles.dangerLink} decoration={false} onPress={deleteChat}>
          Delete chat
        </Link>
      )}
    </Screen>
  );
}

const styles = ThemedStyles.create({
  container: ['flexContainer', 'marginHorizontal7x', 'marginTopL'],
  separator: ['bcolorPrimaryBorder', 'borderTop1x'],
  simpleLink: [
    'colorSecondaryText',
    'fontXL',
    'marginHorizontal7x',
    'marginVertical4x',
  ],
  dangerLink: [
    'colorAlert',
    'fontXL',
    'marginHorizontal7x',
    'marginVertical4x',
  ],
});
