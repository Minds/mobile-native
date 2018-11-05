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
        <Text onPress={this.navToBoostConsole}>{entity.fromObj.name} gifted you {entity.params.impressions} views {description}</Text>
      </View>
    )
  }

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    let params = { hydrate: true };
    params.entity = this.props.entity.entityObj;

    this.props.navigation.push('Activity', params);
  }

  /**
   * Nav to boost console
   */
  navToBoostConsole = (params={}) => {
    this.props.navigation.push('BoostConsole', params);
  }

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    this.props.navigation.push('Channel', { guid: this.props.entity.fromObj.guid });
  }

  getDescription(entity, pron='your') {
    const styles = this.props.styles;

    if (!entity.entityObj) return '';

    let desc = (entity.entityObj.title || entity.entityObj.name || (entity.entityObj.type !== 'user' ? `${pron} post` : `${pron} channel`));

    return (
      <Text>
        <Text>for </Text>
        <Text style={styles.link}>{desc}</Text>
      </Text>
    );
  }
}
