import { observer } from 'mobx-react';
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { IIconSize, Icon } from '~ui/icons';
import { useStores } from '../../../common/hooks/use-stores';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  size?: IIconSize;
  active: boolean;
  style?: ViewStyle;
};

const NotificationsTabIcon = observer((props: PropsType) => {
  const { active, size = 'large', style } = props;
  const { notifications } = useStores();

  React.useEffect(() => {
    if (!notifications.pollInterval) {
      notifications.init();
    }
  });

  return (
    <>
      <Icon
        name="notification"
        size={size}
        active={active}
        activeColor="PrimaryText"
        style={style}
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
