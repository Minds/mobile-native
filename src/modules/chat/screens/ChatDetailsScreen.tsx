import React, { useState } from 'react';
import { View } from 'react-native';
import Link from '~/common/components/Link';
import Toggle from '~/common/components/Toggle';
import { B1, H3, IconButton, Row, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import Member from '../components/Member';

export default function ChatDetailsScreen({ route }) {
  const { members } = route.params ?? {};
  const [expanded, setExpanded] = useState(false);
  const [mute, setMute] = useState(false);
  const privateChat = (members?.length ?? 0) <= 2;
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
          name={expanded ? 'chevron-down' : 'chevron-right'}
          size={32}
          onPress={() => setExpanded(prev => !prev)}
        />
      </Row>
      <View style={styles.separator} />
      <View style={[styles.container, !expanded && { display: 'none' }]}>
        {members.map(member => (
          <Member key={member.guid} member={member} />
        ))}
      </View>
      <View style={styles.separator} />
      {privateChat && (
        <>
          <Link style={styles.simpleLink} decoration={false} onPress={() => {}}>
            Report user
          </Link>
          <Link style={styles.dangerLink} decoration={false} onPress={() => {}}>
            Block user
          </Link>
        </>
      )}
      <Link style={styles.dangerLink} decoration={false} onPress={() => {}}>
        Leave chat
      </Link>
      {myChat && (
        <Link style={styles.dangerLink} decoration={false} onPress={() => {}}>
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
