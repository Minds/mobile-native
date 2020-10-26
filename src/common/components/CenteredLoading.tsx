//@ts-nocheck
import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

export default class CenteredLoading extends Component {
  render() {
    return (
      <View style={styles.activitycontainer} onLayout={this.props.onLayout}>
        <ActivityIndicator
          color={ThemedStyles.getColor('link')}
          size={'large'}
        />
      </View>
    );
  }
}

const styles = {
  activitycontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    minHeight: 100,
    flex: 1,
  },
};
