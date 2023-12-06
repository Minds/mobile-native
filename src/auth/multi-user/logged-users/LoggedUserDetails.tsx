import React from 'react';
import { View } from 'react-native';
import MCIcon from '@expo/vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import Options from './Options';
import UnreadNotifications from './UnreadNotifications';

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
    style={ThemedStyles.style.marginRight}
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

const styles = ThemedStyles.create({
  container: ['rowJustifySpaceEvenly', 'marginRight2x'],
});

export default LoggedUserDetails;
