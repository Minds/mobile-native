import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import {Tooltip} from 'react-native-elements';

export default class InfoPopup extends Component {

  render() {
    return (
      <Tooltip
        pointerColor={'#4A90E2'}
        popover={<Text style={styles.textTooltip}>{this.props.info}</Text>}
        containerStyle={styles.tooltip}>
        <IconMC name="information-variant" size={16} onPress={this.showPopup} color="#AEB0B8"/>
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
