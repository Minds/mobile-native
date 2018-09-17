import React, {
  Component
} from 'react';

import {observer} from "mobx-react/native";
import entities from 'entities';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Tags from '../../../common/components/Tags';
import colors from '../../../styles/Colors';
import { CommonStyle } from '../../../styles/Common';

@observer
export default class ExplicitText extends Component {
  needTruncate = false;

  state = {
    more: false,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
   * toggle overlay
   */
  toogle = () => {
    this.props.entity.toggleMatureVisibility();
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    let message = entities.decodeHTML(this.props.entity.text).trim();

    let body = null;
    let moreLess = null;
    let explicitToggle = null;

    if (message != '') {
      const truncated = this.truncate(message);
      // truncate if necessary
      if (message.length > truncated.length) {
        if (!this.state.more) message = truncated;
        moreLess = this.getMoreLess();
      }

      body = (entity.mature && !entity.mature_visibility) ?
          <Text style={styles.mature}>{message}</Text> :
          <Tags navigation={this.props.navigation} style={this.props.style}>{message}</Tags>

      if (entity.mature ) {
        if (!entity.mature_visibility) {
          explicitToggle = <TouchableOpacity style={[CommonStyle.positionAbsolute, CommonStyle.centered]} onPress={this.toogle}>
            <Icon name="explicit" size={18} color={'black'} style={CommonStyle.shadow}/>
            <Text> Confirm you are 18+</Text>
          </TouchableOpacity>
        } else {
          explicitToggle = <TouchableOpacity style={[CommonStyle.positionAbsoluteTopRight, {marginTop: -15}]} onPress={this.toogle}>
            <Icon name="explicit" size={18} color={'red'} style={CommonStyle.shadow}/>
          </TouchableOpacity>
        }
      }
    }

    return (
      <View style={styles.container}>
        { body }
        { moreLess }
        { explicitToggle }
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
    if (lines.length > 20) {
      lines = lines.slice(0,20);
      truncated = true;
    }

    lines = lines.join('\n');
    if (lines.length > limit) {
      return lines.substr(0, limit) + '...';
    }
    return lines + (truncated ? '...':'');
  }

  /**
   * Get text char limit based on screen height
   */
  getTextLimit() {
    return this.state.height * 1.5;
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
    ...Platform.select({
      ios: {
        color: 'rgba(255, 255, 255, 0.1)',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
          height: -1
        },
      },
      android: {
        color:'transparent',
        textShadowColor: 'rgba(107, 107, 107, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 20
      }
    })
  }
});
