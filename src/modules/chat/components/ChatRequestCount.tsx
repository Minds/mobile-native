import React from 'react';
import { B2, B3, IconCircled, Row } from '~/common/ui';
import MPressable from '~/common/components/MPressable';
import { StyleSheet, View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import { useGetTotalRoomInviteRequestsQuery } from '~/graphql/api';

type Props = {
  onPress: () => void;
};

function ChatRequestCount({ onPress }: Props) {
  const { data } = useGetTotalRoomInviteRequestsQuery(undefined, {
    refetchInterval: 30000,
  });
  data?.totalRoomInviteRequests;
  return data?.totalRoomInviteRequests ? (
    <MPressable onPress={onPress} testID="chatRequestCount">
      <Row horizontal="XL" vertical="M" align="centerStart">
        <IconCircled name="chat" size="medium" />

        <View style={styles.column}>
          <B2 font="medium">Chat request</B2>
          <B3
            color="secondary"
            top="S"
            numberOfLines={1}
            style={styles.message}>
            {data?.totalRoomInviteRequests} pending requests
          </B3>
        </View>
      </Row>
    </MPressable>
  ) : null;
}

export default withErrorBoundary(ChatRequestCount, 'ChatRequestCount');

const styles = StyleSheet.create({
  message: {
    flex: 1,
  },
  column: {
    paddingLeft: 15,
    flex: 1,
    flexDirection: 'column',
  },
  avatar1: {
    zIndex: 1000,
    position: 'absolute',
    top: -10,
    left: 0,
  },
});
