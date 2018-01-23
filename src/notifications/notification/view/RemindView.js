import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Remind Notification Component
 */
export default class RemindView extends Component {

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const body = this.getBody(entity);

    return (
      <View style={styles.bodyContents}>
        {body}
      </View>
    )
  }

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity) {
    const styles = this.props.styles;
    const title = entity.entityObj.title;

    switch (entity.entityObj.type) {
      case "activity":
        return <Text onPress={this.navToActivity}>{entity.fromObj.name} reminded <Text style={styles.link}>{title ? title : `your {entity.entityObj.subtype}`}</Text></Text>

      case "object":
        return <Text onPress={this.navToActivity}>{entity.fromObj.name} reminded <Text style={styles.link}>{ title ? title : 'your activity' }</Text></Text>

      default:
        return <Text>... oops.</Text>
    }
  }
}