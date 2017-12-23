import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react";

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import Tags from '../../../common/components/Tags';

@observer
export default class ExplicitText extends Component {

  render() {
    const entity = this.props.entity;
    const message = this.props.entity.message || this.props.entity.title;
    return (
        <View style={{flex:1}}>
          { entity.mature ?
            <Text style={styles.mature}>{message}</Text>:
            <Tags navigation={this.props.navigation}>{message}</Tags>
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