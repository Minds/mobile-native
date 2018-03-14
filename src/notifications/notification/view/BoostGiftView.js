import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Boost Gift Notification Component
 */
export default class BoostGiftView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToChannel}>{entity.fromObj.name} gifted you {entity.params.impressions} views {description}</Text>
      </View>
    )
  }

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    let params = {};
    params.entity = this.props.entity.entityObj;

    this.props.navigation.navigate('Activity', params);
  }

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.navigate('Channel', { guid: this.props.entity.fromObj.guid });
  }

  getDescription(entity, pron='your') {
    const styles = this.props.styles;

    if (!entity.entityObj) return '';

    let desc = 'for ' + (entity.entityObj.title || entity.entityObj.name || (entity.entityObj.type !== 'user' ? `${pron} post` : `${pron} channel`));

    return (
      <Text style={styles.link}>{desc}</Text>
    );
  }
}