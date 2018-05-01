import _ from 'lodash';

import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  CameraRoll,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager,
  Image,
  View,
  FlatList,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../config/Config';
import { Button } from 'react-native-elements';
import CenteredLoading from '../common/components/CenteredLoading'
import CapturePoster from './CapturePoster';

import CaptureTabs from './CaptureTabs';
import androidPermissionsService from '../common/services/android-permissions.service';

/**
 * Gallery View
 */
export default class CaptureGallery extends PureComponent {

  state = {
    header: null,
    photos: [],
    imageUri: '',
    isPosting: false,
    imagesLoaded: false,
  }

  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    )
  }

  /**
   * Load Photos
   */
  async loadPhotos() {
    let allowed = true;
    if (Platform.OS != 'ios' ) {
      allowed = await androidPermissionsService.checkReadExternalStorage();
      if(!allowed) {
        allowed = await androidPermissionsService.readExternalStorage();
      }
    }

    if (allowed === true) this._loadPhotos();
  }

  /**
   * Load photos
   */
  _loadPhotos() {
    CameraRoll.getPhotos({
      first: 30,
      assetType: 'All',
    })
      .then(r => {
        this.setState({
          imagesLoaded: true,
          photos: r.edges,
          navigation: r.page_info,
        });
      })
      .catch((err) => {
        console.log('Error loading images', err)
        //Error Loading Images
      });
  }

  /**
   * on component mount load photos
   */
  componentWillMount() {
    setTimeout(() => {
      this.loadPhotos();
    }, 50);
  }

  /**
   * Render
   */
  render() {

    const body = this.state.imagesLoaded ?
      _.chunk(this.state.photos.map((p, i) => this.renderTile(p, i)), 3)
        .map((c, i) => <View style={styles.row} key={i}>{c}</View>)
      : <CenteredLoading />

    return (
      <View>
        <CaptureTabs onSelectedMedia={this.onSelected} />
        {body}
      </View>
    )
  }

  /**
   * render list tile
   */
  renderTile = (item, index) => {
    const node = item.node;
    return (
      <TouchableOpacity
        style={styles.tileImage}
        key={index}
        onPress={() => {
            this.onSelected({
              uri: node.image.uri,
              type: node.type,
              fileName: node.image.filename,
              width: node.image.width,
              height: node.image.height
            })
          }
        }
        >
        <Image
          source={{ uri : node.image.uri }}
          style={styles.tileImage}
        />
      </TouchableOpacity>
    );
  }

  onSelectedTile(row) {
    console.log(row);
  }

  onSelected = (response) => {
    this.props.onSelected(response);
  }

}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  },
  row: {
    flexDirection: 'row',
    minHeight: 120,
    flex:1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  tileImage: {
    minHeight: 120,
    flex: 1,
    padding: 1,
  },
  listView: {
    backgroundColor: '#FFF',
    flex:1,
    padding: 1,
  },
  selectedImage: {
    flex:3,
    borderWidth:1,
    borderColor: 'white',
  },
  submitButton: {
    position: 'absolute',
    top:15,
    right:30,
    zIndex:100
  }
});