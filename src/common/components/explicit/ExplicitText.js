import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react/native";
import ReadMore from 'react-native-read-more-text';
import entities from 'entities';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import Tags from '../../../common/components/Tags';

import colors from '../../../styles/Colors';

@observer
export default class ExplicitText extends Component {

  render() {
    const entity = this.props.entity;
    const message = entities.decodeHTML(this.props.entity.text).trim();

    let body;

    if (message == '') {
      body = null;
    } else {
      body = 

      body = <ReadMore
        numberOfLines={4}
        renderTruncatedFooter={this._renderTruncatedFooter}
        renderRevealedFooter={this._renderRevealedFooter}
      >
        { entity.mature ? 
          <Text style={styles.mature}>{message}</Text> :
          <Tags navigation={this.props.navigation} style={this.props.style}>{message}</Tags> }
      </ReadMore>
    }


    return (
        <View style={styles.container}>
            { body }
        </View>
    );
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={styles.readmore} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.readmore} onPress={handlePress}>
        Show less
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  readmore: {
    color: colors.primary,
    marginTop: 5
  },
  mature: {
    color:'transparent',
    textShadowColor: 'rgba(107, 107, 107, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 20
  }
});
