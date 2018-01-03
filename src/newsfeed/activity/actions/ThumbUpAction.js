import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  View
} from 'react-native';

import { Icon } from 'react-native-elements';

import { thumbActivity } from '../ActionsService';
import { CommonStyle } from '../../../styles/Common';

/**
 * Thumb Up Action Component
 */
export default class ThumbUpAction extends PureComponent {
  /**
   * State
   */
  state = {
    voted: false,
    votedCount: 0,
  };

  /**
   * Thumb direction
   */
  direction = 'up';

  /**
   * Action Icon
   */
  iconName = 'thumb-up';

  /**
   * On component will mount
   */
  componentWillMount() {
    let voted = false;

    if (this.props.entity['thumbs:'+this.direction+':user_guids'] && this.props.entity['thumbs:'+this.direction+':user_guids'].indexOf(this.props.me.guid) >= 0) {
      voted = true;
    }
    const votedCount = parseInt(this.props.entity['thumbs:'+this.direction+':count']);

    this.setState({
      voted,
      votedCount
    })
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <Icon onPress={this.toggleThumb} color={this.state.voted ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name={this.iconName} size={20} />
        <Text style={styles.actionIconText}>{this.state.votedCount > 0 ? this.state.votedCount : ''}</Text>
      </View>
    );
  }

  /**
   * Toggle thumb
   */
  toggleThumb = () => {

    this.setState({
      voted: !this.state.voted,
      votedCount: this.state.voted ? this.state.votedCount - 1 : this.state.votedCount + 1
    })

    thumbActivity(this.props.entity.guid, this.direction).then((data) => { }).catch(err => {
      alert(err);
      this.setState({
        voted: !this.state.voted,
        votedCount: this.state.voted ? this.state.votedCount - 1 : this.state.votedCount + 1
      });
    })
  }
}

const styles = StyleSheet.create({
  actionIconText: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 52,
    alignContent: 'center',
    justifyContent: 'center'
  },
  modal: {
    flex: 1,
    paddingTop: 4,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  }
});