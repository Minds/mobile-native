import React, { 
  Component 
} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  CameraRoll,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  ListView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../config/Config';
import { Button } from 'react-native-elements';

export default class GalleryScreen extends Component<{}> {

  state = {
    photos: [],
    imageUri: ' '
  }
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <View style={styles.screenWrapper}>
        <View style={styles.submitButton}>
          { this.state.isPosting ?
            <ActivityIndicator size="small" color="#00ff00" /> : 
            <Icon onPress={() => this.upload()} color="white" name="md-send" size={28}></Icon>
          }
        </View>
        <View style={styles.selectedImage}>
          <Image
            source={{ uri : this.state.imageUri }}
            style={styles.tileImage}
          />
        </View>
        <View style={{flex:2}}>
          <FlatList
            data={this.state.photos}
            renderItem={this.renderTile}
            keyExtractor={item => item.node.image.uri}
            onEndThreshold={0}
            initialNumToRender={27}
            style={styles.listView}
            numColumns={3}
            horizontal={false}
          />
        </View>
      </View>
    );
  }

  upload() {
    this.props.submitToPoster(this.state.imageUri);
  }

  renderTile = (row) => {
    return (
      <TouchableOpacity style={styles.tileImage} onPress={() => this.setState({imageUri: row.item.node.image.uri})}>
        <Image
          source={{ uri : row.item.node.image.uri }}
          style={styles.tileImage}
        />
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    CameraRoll.getPhotos({
      first: 27,
      assetType: 'All',
    })
    .then(r => {
      this.setState({ 
        photos: r.edges,
        navigation: r.page_info,
        imageUri: r.edges[0].node.image.uri
      });
    })
    .catch((err) => {
      //Error Loading Images
    });
  }

}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    flexDirection: 'column'
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
  },
  listView: {
    backgroundColor: '#FFF',
    flex:1
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