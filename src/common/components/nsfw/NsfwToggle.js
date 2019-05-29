import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import Touchable from '../Touchable';
import Colors from '../../../styles/Colors';
import autobind from '../../helpers/autobind';
import testID from '../../helpers/testID';
import i18n from '../../services/i18n.service';

export default class NsfwToggle extends Component {
  constructor(props) {
    super(props);

    this.reasons = [
      { value: 1, label: i18n.t('nsfw.1')},
      { value: 2, label: i18n.t('nsfw.2')},
      { value: 3, label: i18n.t('nsfw.3')},
      { value: 4, label: i18n.t('nsfw.4')},
      { value: 5, label: i18n.t('nsfw.5')},
      { value: 6, label: i18n.t('nsfw.6')},
    ];

    this.menuRef = React.createRef();
  }

  @autobind
  showDropdown() {
    const menu = this.menuRef.current;

    if (!menu) {
      return;
    }

    menu.show();
  }

  @autobind
  toggleDropdownOption(reason) {
    const activeReasonValues = [...(this.props.value || [])];
    const reasonIndex = activeReasonValues.indexOf(reason.value);

    if (reasonIndex > -1) {
      activeReasonValues.splice(reasonIndex, 1);
    } else {
      activeReasonValues.push(reason.value);
    }

    this.props.onChange(activeReasonValues);
  }

  isReasonActive(reason) {
    const activeReasonValues = this.props.value || [];
    return activeReasonValues.indexOf(reason.value) > -1;
  }

  render() {
    const isActive = Boolean(this.props.value && this.props.value.length);
    const button = (
      <Touchable style={this.props.containerStyle} onPress={this.showDropdown} {...testID('NSFW button')}>
        <MdIcon
          name="explicit"
          color={isActive ? Colors.explicit : Colors.darkGreyed}
          size={25}
          style={[this.props.iconStyle, isActive && this.props.iconActiveStyle]}
        />

        {isActive && !this.props.hideLabel && <Text style={this.props.labelStyle}>
          {i18n.t('nsfw.button')}
        </Text>}
      </Touchable>
    );

    return (
      <React.Fragment>
        <Menu ref={this.menuRef} style={styles.menu} button={button}>
          {this.reasons.map((reason, i) => (
            <MenuItem
              key={i}
              onPress={() => this.toggleDropdownOption(reason)}
              textStyle={[styles.menuItemText, this.isReasonActive(reason) && styles.menuItemTextActive]}
              {...testID(`NSFW ${reason.label}`)}
            >{this.isReasonActive(reason) && <MdIcon name="check" />} {reason.label}</MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    width: 180,
    marginTop: 20,
  },
  menuItemText: {
    color: Colors.darkGreyed,
  },
  menuItemIcon: {
    color: 'transparent',
  },
  menuItemTextActive: {
    color: Colors.primary,
  },
  menuItemIconActive: {
    color: Colors.primary,
  },
});
