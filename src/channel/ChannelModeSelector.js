import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import Colors from '../styles/Colors';
import testID from '../common/helpers/testID';
import i18n from '../common/services/i18n.service';
import Button from '../common/components/Button'

/**
 * Channel mode selector
 */
export default
@observer
class ChannelModeSelector extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.modes = [
      { value: 0, label: i18n.t('channel.modeOpen'), handler: () => this.setMode(0)},
      { value: 1, label: i18n.t('channel.modeModerated'), handler: () => this.setMode(1)},
      { value: 2, label: i18n.t('channel.modeClosed'), handler: () => this.setMode(2)},
    ];

    this.menuRef = React.createRef();
  }

  /**
   * Set the channel's mode
   * @param {numeric} value
   */
  setMode(value) {
    this.props.channel.setMode(value);

    this.menuRef.current && this.menuRef.current.hide();
  }

  /**
   * Show the drop down
   */
  showDropdown = () => {
    const menu = this.menuRef.current;

    if (!menu) {
      return;
    }

    menu.show();
  }

  /**
   * Render
   */
  render() {

    const channel = this.props.channel;

    const button = (
      <Button
        onPress={this.showDropdown}
        text={this.modes[channel.mode].label}
        {...testID('Channel mode button')}

      >
        <MdIcon
          name="keyboard-arrow-down"
          color={Colors.primary}
          size={18}
        />
      </Button>
    );

    return (
      <React.Fragment>
        <Menu ref={this.menuRef} style={styles.menu} button={button}>
          {this.modes.map((mode, i) => (
            <MenuItem
              key={i}
              onPress={mode.handler}
              textStyle={[styles.menuItemText, channel.mode === i && styles.menuItemTextActive]}
              {...testID(`Channel ${mode.label}`)}
            >{mode.label}</MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    marginTop: 20,
    width: 180,
  },
  menuItemText: {
    color: Colors.darkGreyed,
  },
  menuItemTextActive: {
    color: Colors.primary,
  }
});
