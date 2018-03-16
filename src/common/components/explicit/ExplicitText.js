import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react/native";
import entities from 'entities';
import {
  Text,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

import Tags from '../../../common/components/Tags';

import colors from '../../../styles/Colors';

@observer
export default class ExplicitText extends Component {
  needTruncate = false;

  state = {
    more: false,
    width: Dimensions.get('window').width
  }

  /**
   * Handle dimensions changes
   */
  dimensionChange = () => {
    this.setState({
      width: Dimensions.get('window').width
    });
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    Dimensions.addEventListener("change", this.dimensionChange);
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    // allways remove listeners on unmount
    Dimensions.removeEventListener("change", this.dimensionChange);
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    let message = entities.decodeHTML(this.props.entity.text).trim();
    
    let body = null;
    let moreLess = null;
    
    if (message != '') {
      const truncated = this.truncate(message);
      // truncate if necessary
      if (message.length != truncated.length) {
        if (!this.state.more) message = truncated;
        moreLess = this.getMoreLess();
      }

      body = entity.mature ? 
          <Text style={styles.mature}>{message}</Text> :
          <Tags navigation={this.props.navigation} style={this.props.style}>{message}</Tags>
    }

    return (
      <View style={styles.container}>
        { body }
        { moreLess }
      </View>
    );
  }

  /**
   * Truncate text
   * @param {string} message 
   */
  truncate(message) {
    const limit = this.getTextLimit();

    let truncated = false;
    let lines = message.split('\n');
    if (lines.length > 4) {
      lines = lines.slice(0,4);
      truncated = true;
    }

    lines = lines.join('\n');
    if (lines.length > limit) {
      return lines.substr(0, limit) + '...';
    }
    return lines + (truncated ? '...':'');
  }

  /**
   * Get text char limit based on screen width
   */
  getTextLimit() {
    return this.state.width / 2;
  }

  /**
   * Returns more or less button
   */
  getMoreLess() {
    const msg = (this.state.more) ? 'Show less' : 'Read More'; 
    return <Text style={styles.readmore} onPress={this.toggleReadMore}>{msg}</Text>
  }

  /**
   * Toggle read more
   */
  toggleReadMore = () => {
    this.setState({more: !this.state.more});
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
