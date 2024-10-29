import React from 'react';
import { View } from 'react-native';
import MCIcon from '@expo/vector-icons/MaterialCommunityIcons';
import Options from './Options';
import UnreadNotifications from './UnreadNotifications';
import sp from '~/services/serviceProvider';

type PropsType = {
  index: number;
  isActive: boolean;
  username: string;
  onSwitchPress: Function;
};

const Icon = () => (
  <MCIcon
    name="check-circle"
    color={'#38A169'}
    size={24}
    style={sp.styles.style.marginRight}
  />
);

const LoggedUserDetails = (props: PropsType) => {
  return (
    <View style={styles.container}>
      {props.isActive ? <Icon /> : <UnreadNotifications index={props.index} />}
      <Options {...props} />
    </View>
  );
};

const styles = sp.styles.create({
  container: ['rowJustifySpaceEvenly', 'marginRight2x'],
});

export default LoggedUserDetails;
