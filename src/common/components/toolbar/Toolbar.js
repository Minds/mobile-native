import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ToolbarItem from './ToolbarItem';

/**
 * Toolbar component
 */
export default class Toolbar extends PureComponent {

  state = {
    selected: null
  }

  /**
   * Component will mount
   */
  componentWillMount() {
    const initial = this.props.initial;

    if (initial) this.state.selected = initial;
  }

  /**
   * change state
   */
  changeState = (val) => {
    if (this.state.selected == val) return;
    this.setState({selected: val});

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(val);
    }
  }

  /**
   * Render
   */
  render() {

    const {
      disableBorder,
      options
    } = this.props;

    const calcStyle = {};

    if (disableBorder) {
      calcStyle.borderBottomWidth = 0;
      calcStyle.borderTopWidth = 0;
    }

    // buttons
    const buttons = options.map(data => {
      return (
        <ToolbarItem
          text={data.text}
          subtext={data.subtext}
          selectedTextStyle={data.selectedTextStyle}
          textStyle={data.textStyle}
          subTextStyle={data.subTextStyle}
          badge={data.badge}
          icon={data.icon}
          key={data.value}
          value={data.value}
          iconType={data.iconType}
          selected={data.value == this.state.selected}
          onPress={this.changeState}
        />
      )
    });

    return (
      <View style={[styles.container, calcStyle]}>
        <View style={styles.topbar}>
        {buttons}
        </View>
      </View>
    );
  }
}

const selectedcolor = '#0071ff';
const color = '#444'

const styles = StyleSheet.create({
  container: {
    //height: 65,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth
    },
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});