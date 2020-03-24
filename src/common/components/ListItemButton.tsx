import React, {Component} from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';
import { CommonStyle as CS } from '../../styles/Common';

export default class ListItemButton extends Component {
  render() {
    return (
        <TouchableOpacity
          {...this.props}
          borderRadius={2}
          style={[styles.container, CS.borderButton, CS.centered]}>
            {this.props.children}
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    padding:4,
  }
});