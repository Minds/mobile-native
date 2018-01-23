import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Feature Notification Component
 */
export default class FeatureView extends Component {

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToActivity}><Text style={styles.link}>{entity.entityObj.title}</Text>was featured</Text>
      </View>
    )
  }
}