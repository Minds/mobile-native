

import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {observer} from "mobx-react/native";

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
  Linking,
} from 'react-native';

import ExplicitImage from './explicit/ExplicitImage'
import AutoHeightFastImage from './AutoHeightFastImage';
import formatDate from '../helpers/date';
import domain from '../helpers/domain';
import MindsVideo from '../../media/MindsVideo';
import mediaProxyUrl from '../helpers/media-proxy-url';

/**
 * Activity
 */
@observer
export default class MediaView extends Component {
  _currentThumbnail = void 0;

  static defaultProps = {
    width: Dimensions.get('window').width
  };

  state = {
    imageLoadFailed: false,
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
        source = this.props.entity.getThumbSource('xlarge');
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
        uri: mediaProxyUrl(this.props.entity.thumbnail_src)
      }

      return (
        <View style={styles.richMediaContainer}>
          { source.uri ? this.getImage(source) : null }
          <TouchableOpacity style={styles.richMedia} onPress={this.openLink}>
            <Text style={styles.title}>{this.props.entity.title}</Text>
            <Text style={styles.domain}>{domain(this.props.entity.perma_url)}</Text>
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
      <View style={styles.videoContainer}>
        <MindsVideo video={{'uri': 'https://d2isvgrdif6ua5.cloudfront.net/cinemr_com/' + guid +  '/360.mp4'}} entity={this.props.entity}/>
      </View>
    );
  }

  imageError = () => {
    this.setState({ imageLoadFailed: true });
  }

  /**
   * Get image with autoheight or Touchable fixed height
   * @param {object} source
   */
  getImage(source) {
    this.source = source;
    const autoHeight = this.props.autoHeight;
    const custom_data = this.props.entity.custom_data;

    if (this.state.imageLoadFailed) {
      let height = 200;

      if (!autoHeight && custom_data && custom_data[0].height && custom_data[0].height != '0') {
        let ratio = custom_data[0].height / custom_data[0].width;
        height = this.props.width * ratio;
      }

      let text = (
        <Text
          style={styles.imageLoadErrorText}
        >The media could not be loaded.</Text>
      );

      if (this.props.entity.perma_url) {
        text = (
          <Text
            style={styles.imageLoadErrorText}
          >The media from <Text style={styles.imageLoadErrorTextDomain}>{domain(this.props.entity.perma_url)}</Text> could not be loaded.</Text>
        );
      }

      return (
        <View style={[styles.imageLoadError, { height }]}>
          {text}
        </View>
      );
    }

    if (custom_data && custom_data[0].height && custom_data[0].height != '0') {
      let ratio = custom_data[0].height / custom_data[0].width;
      let height = this.props.width * ratio;
      return (
        <TouchableOpacity onPress={this.navToImage} style={[styles.imageContainer, { height }]} activeOpacity={1}>
          <ExplicitImage
            source={source}
            entity={this.props.entity}
            style={[styles.image, { height }]}
            disableProgress={this.props.disableProgress}
            onError={this.imageError}
            imageStyle={styles.innerImage}
            />
        </TouchableOpacity>
      );
    }

    return autoHeight  ? (
      <TouchableOpacity
        onPress={this.navToImage}
        style={styles.imageContainer}
        activeOpacity={1}
      >
        <AutoHeightFastImage
          source={source}
          width={this.props.width}
        />
      </TouchableOpacity>
      ) : (
      <TouchableOpacity
        onPress={this.navToImage}
        style={[styles.imageContainer, { minHeight: 200 }]}
        activeOpacity={1}
      >
        <ExplicitImage
          source={source}
          entity={this.props.entity}
          style={styles.image}
          disableProgress={this.props.disableProgress}
          onError={this.imageError}
          imageStyle={styles.innerImage}
        />
      </TouchableOpacity>
    );
  }

  /**
   * Render
   */
  render() {
    const media = this.showMedia();

    if (!media)
      return null;

    return (
      <View style={this.props.style}>
        {  media }
      </View>
    );
  }


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
    
    // if is explicit then should toggle
    if (this.props.entity.mature) {
      this.props.newsfeed.list.newsfeedToggleExplicit(this.props.entity.guid);
      return;
    }

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

}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
    //minHeight: 200,
  },
  image: {
    //height: 200,
    flex: 1,
  },
  innerImage: {
    backgroundColor: 'transparent'
  },
  videoContainer: {
    flex: 1,
    alignItems: 'stretch',
    minHeight: 250,
  },
  title: {
    fontWeight: 'bold',
  },
  richMediaContainer: {
    minHeight: 20,
    //borderWidth: 1,
    //borderColor: '#ececec',
  },
  richMedia: {
    padding: 8,
  },
  domain: {
    fontSize: 11,
    color: '#888',
  },
  imageLoadError: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLoadErrorText: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  imageLoadErrorTextDomain: {
    fontWeight: '600',
  }
});
