import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';


import colors from '../../../styles/Colors';
import { Badge } from 'react-native-elements';
import { CommonStyle } from '../../../styles/Common';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import ThemedStyles from '../../../styles/ThemedStyles';

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
    const buttonStyle = selected ? [styles.button, {borderBottomColor: ThemedStyles.getColor('link')}] : styles.button;

    return (
      <DebouncedTouchableOpacity style={buttonStyle} onPress={() => onPress(value)}>
        {iconCmp}
        <Text style={textStyle} numberOfLines={1}>{text}</Text>
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
      return (selectedTextStyle) ? [styles.buttonSelectedText, CommonStyle.fontS, ThemedStyles.style.colorLink, selectedTextStyle] : [styles.buttonSelectedText, CommonStyle.fontS, ThemedStyles.style.colorLink];
    }

    return (textStyle) ? [styles.buttonText, CommonStyle.fontS, textStyle] : [styles.buttonText, CommonStyle.fontS];
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

    const size = iconSize || 18;
    const iconContainerStyle = {height: size + 4};

    const style = selected ? ThemedStyles.style.colorLink : ThemedStyles.style.colorIcon;
    if (!icon) {
      return (
        <View style={iconContainerStyle}>
          <Text style={style}>{badge}</Text>
        </View>
      );
    }

    if (iconType == 'ion') {
      IconType = IonIcon;
    } else {
      IconType = Icon;
    }

    return (
      <View style={iconContainerStyle}>
        <IconType name={icon} size={size || 18} style={style} />
      </View>
    )
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
  },
  buttonText: {
    paddingTop:3,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
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