import React, {PureComponent} from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';

import Icon from 'react-native-vector-icons/Ionicons';

import CenteredLoading from '../common/components/CenteredLoading';
import androidPermissionsService from '../common/services/android-permissions.service';
import testID from '../common/helpers/testID';
import logService from '../common/services/log.service';
import { CommonStyle } from '../styles/Common';
import { View } from 'react-native-animatable';

/**
 * Gallery View
 */
export default class CaptureGallery extends PureComponent {

  listRef = null;

  state = {
    photos: [],
    imagesLoaded: false,
    offset: '',
    hasMore: true,
    loading: false,
  };

  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    ),
  };

  /**
   * Load Photos
   */
  async loadPhotos() {
    let allowed = true;
    if (Platform.OS !== 'ios') {
      allowed = await androidPermissionsService.checkReadExternalStorage();
      if (!allowed) {
        allowed = await androidPermissionsService.readExternalStorage();
      }
    }

    if (allowed === true) {
      this._loadPhotos();
    }
  }

  /**
   * Load photos
   */
  _loadPhotos = async() => {
    if (this.state.loading || !this.state.hasMore) {
      return;
    }

    const params = {
      first: 30,
      assetType: 'All',
    };

    this.setState({loading: true});

    if (Platform.OS === 'ios') {
      params.groupTypes = 'All';
    }
    if (this.state.offset) {
      params.after = this.state.offset;
    }

    try {
      const result = await CameraRoll.getPhotos(params);

      this.setState({
        imagesLoaded: true,
        photos: this.state.photos.concat(result.edges),
        offset: result.page_info.end_cursor,
        hasMore: result.page_info.has_next_page,
        loading: false
      });
    } catch (err) {
      logService.exception('[CaptureGallery] loadPhotos', err)
      this.setState({loading: false});
    }
  };

  /**
   * on component mount load photos
   */
  componentDidMount() {
    setTimeout(() => {
      this.loadPhotos();
    }, 50);
  }

  /**
   * Render
   */
  render() {
    if (!this.state.imagesLoaded) {
      return <CenteredLoading />;
    }

    return (
      <FlatList
        ref={this.setListRef}
        ListHeaderComponent={this.props.header}
        data={this.state.photos}
        renderItem={this.renderTile}
        onEndReached={this._loadPhotos}
        ListFooterComponent={this.state.loading ? <CenteredLoading /> : null}
        numColumns={3}
      />
    );
  }

  /**
   * Sets List reference
   */
  setListRef = ref => this.listRef = ref;

  /**
   * render list tile
   */
  renderTile = (item) => {
    const node = item.item.node;

    const icon = node.type.startsWith('video') ? (
        <View style={[CommonStyle.positionAbsolute, CommonStyle.centered]}>
          <Icon name="ios-play-circle" size={24} style={CommonStyle.colorWhite}/>
        </View>
      ) : null;

    return (
      <TouchableOpacity
        style={styles.tileImage}
        key={item.index}
        onPress={
          () => {
            this.onSelected({
              uri: node.image.uri,
              type: node.type,
              fileName: node.image.filename,
              duration: node.image.playableDuration,
              width: node.image.width,
              height: node.image.height,
            });
          }
        }
        {...testID(`Gallery ${node.type}`)}
        >
        <Image
          source={{ uri : node.image.uri }}
          style={styles.tileImage}
        >
        </Image>
        {icon}
      </TouchableOpacity>
    );
  }

  /**
   * On media selected
   */
  onSelected = (response) => {
    // scroll to top on selection
    this.listRef.scrollToOffset({x: 0, y: 0, animated: true});

    this.props.onSelected(response);
  }

}

const styles = StyleSheet.create({
  tileImage: {
    minHeight: 120,
    flex: 1,
    padding: 1,
  }
});