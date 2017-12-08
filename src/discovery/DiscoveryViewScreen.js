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

  state = {
    height: 400
  };

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
      <ScrollView>
        <OwnerBlock entity={entity.ownerObj} navigation={this.props.navigation}>
          <Text style={styles.timestamp}>{this.formatDate(entity.time_created)}</Text>
        </OwnerBlock>
        <View style={styles.textcontainer}>
          <Text>{entity.title}</Text>
        </View>
        {view}
        <Actions entity={entity}></Actions>
      </ScrollView>
    )
  }

  getView(entity) {
    Image.getSize(entity.thumbnail_src, (width, height) => {
      this.setState({height})
    }, (error) => {
      console.error(`Couldn't get the image size: ${error.message}`);
    });

    switch (entity.subtype) {
      case 'image':
        const imguri = { uri: entity.thumbnail_src };
        return  <Image
                  source={imguri}
                  style={{ height: this.state.height }} 
                  resizeMode="contain"
                />;

      default:
        return <Text>Not Implemented</Text>
    }
  }
}

const styles = StyleSheet.create({
  textcontainer: {
    paddingLeft: 10,
  },
  image: {
    flex:1
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});

