import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import ToolbarItem from './ToolbarItem';


export default class Toolbar extends PureComponent {

  state = {
    selected: null
  }

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
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});