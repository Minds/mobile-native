import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import Tags from '../../../common/components/Tags';

export default class ExplicitText extends Component {

  render() {
    return (
        <View style={{flex:1}}>
          { this.props.entity.mature ?
            <Text style={styles.mature}>{this.props.entity.message}</Text>:
            <Tags navigation={this.props.navigation}>{this.props.entity.message}</Tags>
          }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  mature: {
    color:'transparent',
    textShadowColor: 'rgba(107, 107, 107, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 20
  }
});