import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react";

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image
} from 'react-native';

import AutoHeightFastImage from '../../common/components/AutoHeightFastImage';

import ExplicitImage from '../../common/components/explicit/ExplicitImage'
import ExplicitText from '../../common/components/explicit/ExplicitText'
import OwnerBlock from './OwnerBlock';
import RemindOwnerBlock from './RemindOwnerBlock';
import Actions from './Actions';
import FastImage from 'react-native-fast-image';
import formatDate from '../../common/helpers/date';

/**
 * Activity
 */
@observer
export default class Activity extends Component {

  /**
   * Nav to activity full screen
   */
  navToActivity = () => {
    this.props.navigation.navigate('Activity', {entity: this.props.entity});
  }

  /**
   * Nav to full image with zoom
   */
  navToImage = () => {
    this.props.navigation.navigate('ViewImage', { source: this.source });
  }

  /**
   * Render
   */
  render() {
    return (
        <View style={styles.container}>
          { this.showOwner() }
          <View style={this.props.entity.message ? styles.message : styles.emptyMessage}>
            <ExplicitText entity={this.props.entity}  navigation={this.props.navigation}/>
          </View>
          { this.showRemind() }
          { this.showMedia() }
          { this.showActions() }
        </View>
    );
  }

  /**
   * Show activity media
   */
  showMedia() {
    let media;

    switch (this.props.entity.custom_type) {
      case "batch":
        let source = {
          uri: this.props.entity.custom_data[0].src
        }
        return this.getImage(source);
    }

    if (this.props.entity.perma_url) {
      let source = {
        uri: this.props.entity.thumbnail_src
      }

      return (
        <View>
          {this.getImage(source)}
          <View style={styles.message}>
            <Text style={styles.title}>{this.props.entity.title}</Text>
            <Text style={styles.timestamp}>{this.props.entity.perma_url}</Text>
          </View>
        </View>
      )
    }
    return null;
  }

  /**
   * Get image with autoheight or Touchable fixed height
   * @param {object} source
   */
  getImage(source) {
    this.source = source;
    const autoHeight = this.props.autoHeight;
    return autoHeight ? <AutoHeightFastImage source={source} width={Dimensions.get('window').width} /> : (
      <TouchableOpacity onPress={this.navToImage} style={styles.imageContainer}>
        <ExplicitImage source={source} entity={this.props.entity} style={styles.image} />
      </TouchableOpacity>
    );
  }

  /**
   * Show Owner
   */
  showOwner() {
    if (!this.props.entity.remind_object) {
      return (
        <OwnerBlock entity={this.props.entity} newsfeed={this.props.newsfeed} navigation={this.props.navigation}>
          <TouchableOpacity onPress={this.navToActivity}>
            <Text style={styles.timestamp}>{formatDate(this.props.entity.time_created)}</Text>
          </TouchableOpacity>
        </OwnerBlock>
      );
    } else {
      return <RemindOwnerBlock entity={this.props.entity} newsfeed={this.props.newsfeed} navigation={this.props.navigation} />;
    }
  }

  /**
   * Show remind activity
   */
  showRemind() {
    if (this.props.entity.remind_object) {
      return (
        <View style={styles.remind}>
          <Activity hideTabs={true} newsfeed={this.props.newsfeed} entity={this.props.entity.remind_object} navigation={this.props.navigation} />
        </View>
      );
    }
  }

  /**
   * Show actions
   */
  showActions() {
    if (!this.props.hideTabs) {
      return <Actions entity={this.props.entity} navigation={this.props.navigation}></Actions>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  message: {
    padding: 8
  },
  emptyMessage: {
    padding: 0
  },
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
    height: 200,
  },
  image: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  remind: {
    flex:1,
  }
});