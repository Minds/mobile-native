import React, {
  Component
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
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../config/Config';
import { Button } from 'react-native-elements';
import CenteredLoading from '../common/components/CenteredLoading'
import CapturePoster from './CapturePoster';

import CaptureTabs from './CaptureTabs';
import androidPermissionsService from '../common/services/android-permissions.service'

/**
 * Gallery View
 */
export default class CaptureGallery extends Component {

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
  loadPhotos() {
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
        if (androidPermissionsService.readExternalStorage()) {
          this.loadPhotos();
        }
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

    const tabs = (
      <View>
        <CaptureTabs onSelectedMedia={ this.onSelected } />
      </View>
    );

    return (
      <View style={styles.screenWrapper}>

        <View style={{flex:2}}>
          { this.state.imagesLoaded ?
            <FlatList
              data={this.state.photos}
              renderItem={this.renderTile}
              keyExtractor={item => item.node.image.uri}
              onEndThreshold={0}
              initialNumToRender={27}
              style={styles.listView}
              numColumns={3}
              horizontal={false}
              ListHeaderComponent={ tabs }
            /> :
            <CenteredLoading/>
          }
        </View>
      </View>
    );
  }

  /**
   * render list tile
   */
  renderTile = (row) => {
    const node = row.item.node;
    return (
      <TouchableOpacity
        style={styles.tileImage}
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