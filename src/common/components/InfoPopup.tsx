//@ts-nocheck
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Tooltip } from 'react-native-elements';
import IconMC from '@expo/vector-icons/MaterialCommunityIcons';

import MText from './MText';

export default class InfoPopup extends Component {
  render() {
    return (
      <Tooltip
        width={350}
        height={100}
        pointerColor={'#4A90E2'}
        popover={<MText style={styles.textTooltip}>{this.props.info}</MText>}
        containerStyle={styles.tooltip}>
        <IconMC
          name="information-variant"
          size={16}
          onPress={this.showPopup}
          color="#AEB0B8"
        />
      </Tooltip>
    );
  }
}

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: '#4A90E2',
  },
  textTooltip: {
    color: '#FFF',
  },
});
