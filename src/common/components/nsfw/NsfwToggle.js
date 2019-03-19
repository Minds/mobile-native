import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import Touchable from '../Touchable';
import Colors from '../../../styles/Colors';
import autobind from '../../helpers/autobind';

export default class NsfwToggle extends Component {
  constructor(props) {
    super(props);

    this.reasons = [
      { value: 1, label: 'Nudity' },
      { value: 2, label: 'Pornography' },
      { value: 3, label: 'Profanity' },
      { value: 4, label: 'Violence and Gore' },
      { value: 5, label: 'Race and Religion' },
      { value: 6, label: 'Other' },
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

    return (
      <React.Fragment>
        <Touchable style={this.props.containerStyle} onPress={this.showDropdown}>
          <MdIcon
            name="explicit"
            color={isActive ? Colors.explicit : Colors.darkGreyed}
            size={25}
            style={this.props.iconStyle}
          />

          {isActive && <Text style={this.props.labelStyle}>
            NSFW
          </Text>}
        </Touchable>

        <Menu ref={this.menuRef} style={styles.menu}>
          {this.reasons.map(reason => (
            <MenuItem onPress={() => this.toggleDropdownOption(reason)}>
              <MdIcon style={[styles.menuItemIcon, this.isReasonActive(reason) && styles.menuItemIconActive]} name="check" />
              {'\u0020'}
              <Text style={[styles.menuItemText, this.isReasonActive(reason) && styles.menuItemTextActive]}>{reason.label}</Text>
            </MenuItem>
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
