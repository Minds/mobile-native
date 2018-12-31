import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';


import colors from '../../../styles/Colors';
import { Badge } from 'react-native-elements';
import { CommonStyle } from '../../../styles/Common';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';

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
      value,
      selected,
      onPress,
    } = this.props;

    const iconCmp = this.getIcon(selected);
    const textStyle = this.getTextStyle();
    const subTextStyle = this.getSubTextStyle();
    const buttonStyle = selected ? [styles.button, styles.buttonSelected] : styles.button;

    return (
      <DebouncedTouchableOpacity style={buttonStyle} onPress={() => onPress(value)}>
        {iconCmp}
        <Text style={textStyle}>{text}</Text>
        {subtext && <Text style={subTextStyle}>{subtext}</Text>}
        {this.getBadge()}
      </DebouncedTouchableOpacity>
    );
  }

  getBadge() {
    const {badge, icon} = this.props;
    return (badge && icon) ?
      <Badge value={this.props.badge} containerStyle={styles.badgeStyle} wrapperStyle={styles.wrapperStyle} textStyle={styles.badgeText}/>:
      null;
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
   * @param {boolean} selected
   */
  getIcon(selected) {
    const {
      icon,
      iconType,
      iconSize,
      badge
    } = this.props;

    if (!icon && !badge) return null;

    if (!icon) {
      const style = {color: selected ? colors.primary : color};
      return <Text style={style}>{badge}</Text>
    }

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
  },
  badgeStyle: {
    backgroundColor: colors.explicit,
    padding: 3,
  },
  wrapperStyle: {
    position:'absolute',
    top: -8,
    right: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '400'
  }
});