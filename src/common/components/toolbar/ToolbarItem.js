import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default class ToolbarItem extends PureComponent {

  /**
   * Render
   */
  render() {
    const {
      text,
      icon,
      value,
      selected,
      onPress,
      iconType,
      iconSize
    }  = this.props;

    let IconType;

    if (iconType=='ion') {
      IconType = IonIcon;
    } else {
      IconType = Icon;
    }

    return (
      <TouchableOpacity style={styles.button} onPress={() => onPress(value)}>
        <IconType name={icon} size={iconSize||18} color={selected ? selectedcolor : color} />
        <Text style={selected ? styles.buttonSelectedText : styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const selectedcolor = '#0071ff';
const color = '#444'

const styles = StyleSheet.create({
  buttonSelectedText: {
    paddingTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: selectedcolor
  },
  buttonText: {
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 10
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
  },
});