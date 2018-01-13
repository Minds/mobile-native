import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

/**
 * Toolbar Item
 */
export default class ToolbarItem extends PureComponent {

  /**
   * Render
   */
  render() {
    const {
      text,
      subtext,
      icon,
      value,
      selected,
      onPress,
      iconType,
      iconSize,
      selectedTextStyle,
    } = this.props;

    const iconCmp = this.getIcon(icon, iconType, iconSize, selected);
    const textStyle = this.getTextStyle();
    const subTextStyle = this.getSubTextStyle();

    return (
      <TouchableOpacity style={styles.button} onPress={() => onPress(value)}>
        {iconCmp}
        <Text style={textStyle}>{text}</Text>
        {subtext && <Text style={subTextStyle}>{subtext}</Text>}
      </TouchableOpacity>
    );
  }

  getSubTextStyle() {
    const {
      subTextStyle,
    } = this.props;

    const style = this.getTextStyle();

    style.push(styles.subtext);

    if (subTextStyle) {
      style.push(subTextStyle);
    }

    return style;
  }

  getTextStyle() {
    const {
      selected,
      selectedTextStyle,
      textStyle,
    } = this.props;

    if (selected) {
      return (selectedTextStyle) ? [styles.buttonSelectedText, selectedTextStyle] : [styles.buttonSelectedText];
    }

    return (textStyle) ? [styles.buttonText, textStyle] : [styles.buttonText];
  }

  /**
   * Get the icon component
   * @param {string|undefined} icon
   * @param {string|undefined} iconType
   * @param {int|undefined} iconSize
   * @param {boolean} selected
   */
  getIcon(icon, iconType, iconSize, selected) {
    if (!icon) return null;

    if (iconType == 'ion') {
      IconType = IonIcon;
    } else {
      IconType = Icon;
    }

    return <IconType name={icon} size={iconSize || 18} color={selected ? selectedcolor : color} />
  }
}

const selectedcolor = '#0071ff';
const color = '#444'

const styles = StyleSheet.create({
  subtext: {
    paddingTop: 0,
    fontSize: 9
  },
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