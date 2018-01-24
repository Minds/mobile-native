import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react";

import {
  MINDS_URI,
  MINDS_CDN_URI
} from '../../config/Config';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Linking
} from 'react-native';

import AutoHeightFastImage from '../../common/components/AutoHeightFastImage';

import MindsVideo from '../../media/MindsVideo';
import ExplicitImage from '../../common/components/explicit/ExplicitImage'
import ExplicitText from '../../common/components/explicit/ExplicitText'
import OwnerBlock from './OwnerBlock';
import RemindOwnerBlock from './RemindOwnerBlock';
import Actions from './Actions';
import formatDate from '../../common/helpers/date';
import domain from '../../common/helpers/domain';
import ActivityActions from './ActivityActions';

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
    // if is a rich embed should load link
    if (this.props.entity.perma_url) {
      this.openLink();
    } else {
      this.props.navigation.navigate('ViewImage', { source: this.source });
    }
  }

  /**
   * Open a link
   */
  openLink = () => {
    Linking.openURL(this.props.entity.perma_url);
  }

  /**
   * Render
   */
  render() {
    return (
        <View style={styles.container}>
          { this.showOwner() }
          { this.props.entity.message || this.props.entity.title ?
            <View style={this.props.entity.message || this.props.entity.title ? styles.message : styles.emptyMessage}>
              <ExplicitText entity={this.props.entity}  navigation={this.props.navigation}/>
            </View>
            : null
          }
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
    let source;

    const type = this.props.entity.custom_type||this.props.entity.subtype;
    switch (type) {
      case 'image':
        source = {
          uri: MINDS_CDN_URI + 'api/v1/archive/thumbnails/' + this.props.entity.guid + '/medium' 
        }
        return this.getImage(source);
      case 'batch':
        source = {
          uri: this.props.entity.custom_data[0].src
        }
        return this.getImage(source);
      case 'video':
        return this.getVideo();
    }

    if (this.props.entity.perma_url) {
      source = {
        uri: this.props.entity.thumbnail_src
      }

      return (
        <View>
          {this.getImage(source)}
          <TouchableOpacity style={styles.message} onPress={this.openLink}>
            <Text style={styles.title}>{this.props.entity.title}</Text>
            <Text style={styles.timestamp}>{domain(this.props.entity.perma_url)}</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return null;
  }

  /* URL is -> MINDS_URI + 'api/v1/media/' + this.props.entity.custom_data.guid + '/play'*/
  getVideo() {
    let guid;
    if (this.props.entity.custom_data) {
      guid = this.props.entity.custom_data.guid;
    } else {
      guid = this.props.entity.cinemr_guid;
    }
    return (
      <View style={styles.imageContainer}>
        <MindsVideo video={{'uri': 'https://d2isvgrdif6ua5.cloudfront.net/cinemr_com/' + guid +  '/360.mp4'}} entity={this.props.entity}/>
      </View>
    );
  }
  /**
   * Get image with autoheight or Touchable fixed height
   * @param {object} source
   */
  getImage(source) { 
    this.source = source;
    const autoHeight = this.props.autoHeight;
    return autoHeight ? <AutoHeightFastImage source={source} width={Dimensions.get('window').width} /> : (
      <TouchableOpacity onPress={this.navToImage} style={styles.imageContainer} activeOpacity={1}>
        <ExplicitImage source={source} entity={this.props.entity} style={styles.image} disableProgress={this.props.disableProgress}/>
      </TouchableOpacity>
    );
  }

  /**
   * Show Owner
   */
  showOwner() {
    if (!this.props.entity.remind_object) {
      const rightToolbar = (
         <View style={styles.rightToolbar}>
            <ActivityActions newsfeed={this.props.newsfeed} entity={this.props.entity}/>
          </View>
      )
      return (
        <OwnerBlock entity={this.props.entity} navigation={this.props.navigation} rightToolbar={rightToolbar}>
          <TouchableOpacity onPress={this.navToActivity}>
            <Text style={styles.timestamp}>{formatDate(this.props.entity.time_created)}</Text>
          </TouchableOpacity>
        </OwnerBlock>
      );
    } else {
      return <RemindOwnerBlock 
                entity={this.props.entity} 
                newsfeed={this.props.newsfeed}
                navigation={this.props.navigation} 
                />;
    }
  }

  /**
   * Show remind activity
   */
  showRemind() {
    if (this.props.entity.remind_object) {
      return (
        <View style={styles.remind}>
          <Activity 
            hideTabs={true}
            newsfeed={this.props.newsfeed}
            entity={this.props.entity.remind_object}
            navigation={this.props.navigation}
            />
        </View>
      );
    }
  }

  /**
   * Show actions
   */
  showActions() {
    if (!this.props.hideTabs) {
      return <Actions 
                entity={this.props.entity}
                navigation={this.props.navigation}
                />
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
  //  flex:1,
  },
  rightToolbar: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 20
  },
});