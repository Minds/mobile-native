import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import sp from '~/services/serviceProvider';

type Props = {
  onLayout?: () => void;
};

export default class CenteredLoading extends Component<Props> {
  render() {
    return (
      <View style={styles.activityContainer} onLayout={this.props.onLayout}>
        <ActivityIndicator color={sp.styles.getColor('Link')} size={'large'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    minHeight: 100,
    flex: 1,
  },
});
