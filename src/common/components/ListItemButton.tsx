//@ts-nocheck
import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

export default class ListItemButton extends TouchableOpacity {
  render() {
    const CS = ThemedStyles.style;
    return (
      <TouchableOpacity
        {...this.props}
        borderRadius={2}
        style={[
          styles.container,
          CS.borderPrimary,
          CS.centered,
          this.props.style,
        ]}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 4,
  },
});
