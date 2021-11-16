import { observer } from 'mobx-react';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '~ui/icons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { useStores } from '../../../common/hooks/use-stores';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size?: number;
  active: boolean;
};

const NotificationsTabIcon = observer((props: PropsType) => {
  const active = props.active;
  const { notifications } = useStores();

  React.useEffect(() => {
    if (!notifications.pollInterval) {
      notifications.init();
    }
  });

  const showIndicator = notifications.unread > 0;

  const Indicator = React.useMemo(
    () => (
      <>
        <FAIcon
          name="circle"
          size={15}
          color={ThemedStyles.getColor('SecondaryBackground')}
          style={styles.unreadBackground}
        />
        <FAIcon
          name="circle"
          size={10}
          color="#E02020"
          style={styles.unread}
          accessibilityLabel={'redDotIcon'}
        />
      </>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <Icon size="large" name="notification" active={active} />
      {showIndicator && Indicator}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBackground: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: 1,
    left: 15,
  },
  unread: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    top: 3.5,
    left: 17,
  },
});

export default NotificationsTabIcon;
