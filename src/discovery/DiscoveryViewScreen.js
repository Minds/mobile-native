import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';

import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import Actions from '../newsfeed/activity/Actions';

/**
 * Discovery View screen
 */
export default class DiscoveryViewScreen extends Component {

  getEntity() {
    return this.props.navigation.state.params.entity;
  }

  formatDate(timestamp) {
    const t = new Date(timestamp * 1000);
    return t.toDateString();
  }

  render() {
    const entity = this.getEntity();

    const view = this.getView(entity);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <OwnerBlock entity={entity.ownerObj} navigation={this.props.navigation}>
          <Text style={styles.timestamp}>{this.formatDate(entity.time_created)}</Text>
        </OwnerBlock>
        {view}
        <Actions entity={entity}></Actions>
      </ScrollView>
    )
  }

  getView(entity) {
    switch (entity.subtype) {
      case 'image':
        const imguri = { uri: entity.thumbnail_src };
        return <Image
          source={imguri}
          style={styles.image}
          resizeMode="contain"
        />

      default:
        return <Text>Not Implemented</Text>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  image: {
    width: null,
    height: 400
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});

