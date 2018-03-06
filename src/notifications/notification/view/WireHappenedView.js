import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

import sessionService from '../../../common/services/session.service';

/**
 * Wired Happened Notification Component
 */
export default class WireHappenedView extends Component {

  /**
   * Navigate From channel
   */
  navFromChannel = () => {
    this.props.navigation.navigate('Channel', { guid: this.props.entity.from.guid });
  }

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.navigate('Channel', { guid: this.props.entity.to.guid });
  }

  /**
   * Render
   */
  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    const subscribed = entity.params.subscribed;
    const isOwn = entity.params.from_guid == sessionService.guid;

    let text = '';

    if (!subscribed && isOwn) {
      text = <Text>You have successfully wired {entity.params.amount} to <Text style={styles.link} onPress={this.navToChannel}>@{entity.params.to_username}</Text></Text>
    } else if (!subscribed && !isOwn) {
      text = <Text>You have received a wire of {entity.params.amount} from <Text style={styles.link} onPress={this.navFromChannel}>@{entity.params.from_username}</Text></Text>
    } else if (subscribed && isOwn) {
      text = <Text>You have subscribed to wire {entity.params.amount}/month to <Text style={styles.link} onPress={this.navToChannel}>@{entity.params.to_username}</Text></Text>
    } else if (subscribed && !isOwn) {
      text = <Text>You have received a wire subscription of {entity.params.amount}/month from <Text style={styles.link} onPress={this.navFromChannel}>@{entity.params.from_username}</Text></Text>
    }

    return (
      <View style={styles.bodyContents}>
        {text}
      </View>
    )
  }
}
