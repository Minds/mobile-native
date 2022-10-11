import { observer } from 'mobx-react';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '~ui/icons';
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

  return (
    <>
      <Icon
        size="large"
        name="notification"
        active={active}
        activeColor="PrimaryText"
      />
      {notifications.unread > 0 ? (
        <View
          style={[
            styles.unread,
            { borderColor: ThemedStyles.getColor('SecondaryBackground') },
          ]}
        />
      ) : undefined}
    </>
  );
});

const styles = StyleSheet.create({
  unread: {
    position: 'absolute',
    top: 7,
    left: 15,
    backgroundColor: '#E02020',
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
});

export default NotificationsTabIcon;
