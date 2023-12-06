//@ts-nocheck
import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import Icon from '@expo/vector-icons/MaterialIcons';
import IonIcon from '@expo/vector-icons/Ionicons';
import { Badge } from 'react-native-elements';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../MText';

const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

/**
 * Toolbar Item
 */
export default class ToolbarItem extends PureComponent {
  /**
   * Render
   */
  render() {
    const { text, subtext, value, selected, onPress } = this.props;

    const iconCmp = this.getIcon(selected);
    const textStyle = this.getTextStyle();
    const subTextStyle = this.getSubTextStyle();
    const buttonStyle = selected
      ? [styles.button, { borderBottomColor: ThemedStyles.getColor('Link') }]
      : styles.button;

    return (
      <DebouncedTouchableOpacity
        style={buttonStyle}
        onPress={() => onPress(value)}>
        {iconCmp}
        <MText style={textStyle} numberOfLines={1}>
          {text}
        </MText>
        {subtext && <MText style={subTextStyle}>{subtext}</MText>}
        {this.getBadge()}
      </DebouncedTouchableOpacity>
    );
  }

  getBadge() {
    const { badge, icon } = this.props;
    return badge && icon ? (
      <Badge
        value={this.props.badge}
        containerStyle={badgeStyle}
        wrapperStyle={styles.wrapperStyle}
        textStyle={styles.badgeText}
      />
    ) : null;
  }

  getSubTextStyle() {
    const { subTextStyle } = this.props;

    const style = this.getTextStyle(); // clone

    style.push(styles.subtext);

    if (subTextStyle) {
      style.push(subTextStyle);
    }

    return style;
  }

  getTextStyle() {
    const { selected, selectedTextStyle, textStyle } = this.props;

    if (selected) {
      return selectedTextStyle
        ? [
            styles.buttonSelectedText,
            ThemedStyles.style.fontS,
            ThemedStyles.style.colorIconActive,
            selectedTextStyle,
          ]
        : [
            styles.buttonSelectedText,
            ThemedStyles.style.fontS,
            ThemedStyles.style.colorIconActive,
          ];
    }

    return textStyle
      ? [styles.buttonText, ThemedStyles.style.fontS, textStyle]
      : [styles.buttonText, ThemedStyles.style.fontS];
  }

  /**
   * Get the icon component
   * @param {boolean} selected
   */
  getIcon(selected) {
    const { icon, iconType, iconSize, badge } = this.props;

    if (!icon && !badge) return null;

    const size = iconSize || 18;
    const iconContainerStyle = { height: size + 4 };

    const style = selected
      ? ThemedStyles.style.colorIconActive
      : ThemedStyles.style.colorIcon;
    if (!icon) {
      return (
        <View style={iconContainerStyle}>
          <MText style={style}>{badge}</MText>
        </View>
      );
    }
    let IconType;

    if (iconType === 'ion') {
      IconType = IonIcon;
    } else {
      IconType = Icon;
    }

    return (
      <View style={iconContainerStyle}>
        <IconType name={icon} size={size || 18} style={style} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subtext: {
    paddingTop: 0,
    fontSize: 9,
  },
  buttonSelectedText: {
    paddingTop: 5,
    textAlign: 'center',
  },
  buttonText: {
    paddingTop: 3,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },

  wrapperStyle: {
    position: 'absolute',
    top: -8,
    right: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '400',
  },
});

const badgeStyle = ThemedStyles.combine(
  {
    padding: 3,
  },
  'bgAlert',
);
