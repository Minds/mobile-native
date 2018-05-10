import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import colors from '../../../styles/Colors';

import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import { CommonStyle } from '../../../styles/Common';

DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

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
    } = this.props;

    const iconCmp = this.getIcon(icon, iconType, iconSize, selected);
    const textStyle = this.getTextStyle();
    const subTextStyle = this.getSubTextStyle();
    const buttonStyle = selected ? [styles.button, styles.buttonSelected] : styles.button;

    return (
      <DebouncedTouchableOpacity style={buttonStyle} onPress={() => onPress(value)}>
        {iconCmp}
        <Text style={textStyle}>{text}</Text>
        {subtext && <Text style={subTextStyle}>{subtext}</Text>}
      </DebouncedTouchableOpacity>
    );
  }

  getSubTextStyle() {
    const {
      subTextStyle,
    } = this.props;

    const style = this.getTextStyle() // clone

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
      return (selectedTextStyle) ? [styles.buttonSelectedText, CommonStyle.fontXS, selectedTextStyle] : [styles.buttonSelectedText, CommonStyle.fontXS];
    }

    return (textStyle) ? [styles.buttonText, CommonStyle.fontXS, textStyle] : [styles.buttonText, CommonStyle.fontXS];
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

    return <IconType name={icon} size={iconSize || 18} color={selected ? colors.primary : color} />
  }
}

const color = '#444'

const styles = StyleSheet.create({
  subtext: {
    paddingTop: 0,
    fontSize: 9
  },
  buttonSelectedText: {
    paddingTop: 5,
    textAlign: 'center',
    color: colors.primary
  },
  buttonText: {
    paddingTop:5,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  buttonSelected: {
    borderBottomColor: colors.primary,
  }
});