//@ts-nocheck
import React, { PureComponent } from 'react';

import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { ColorValue, StyleSheet } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';

const styles = StyleSheet.create({
  icon: { width: 68, textAlign: 'center' },
});

interface PropsType {
  color: ColorValue;
  size?: number;
  name: string;
}

export default class TabIcon extends PureComponent<PropsType> {
  render() {
    const theme = ThemedStyles.style;
    const { name, size, color } = this.props;
    let icon;
    switch (name) {
      case 'plus':
      case 'user':
        return (
          <EvilIcons
            name={name}
            color={color}
            style={styles.icon}
            size={size ? size : 24}
          />
        );
      case 'home':
        return (
          <Entypo
            name={name}
            color={color}
            style={styles.icon}
            size={size ? size : 24}
          />
        );
      case 'md-notifications':
      case 'md-menu':
        icon = (
          <IonIcon
            name={name}
            color={color}
            style={styles.icon}
            size={size ? size : 24}
          />
        );
        break;
      case 'search':
        icon = (
          <IonIcon
            name={name}
            color={color}
            style={styles.icon}
            size={size ? size : 24}
          />
        );
        break;
    }
    return icon;
  }
}
