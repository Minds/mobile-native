import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, Text,Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import NewsfeedList from './NewsfeedList';
import api from './../common/services/api.service';

import { post } from './NewsfeedService';

@inject('user')
@observer
export default class Poster extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  state = {
    isPosting: false,
    text: '',
    postImageUri: '',
    hasAttachment:false,
    progress:0
  };

  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.posterWrapper}>
          <View style={styles.poster}>
            <TextInput
              style={{flex: 5}}
              editable = {true}
              placeholder = 'Speak your mind...'
              placeholderTextColor = '#ccc'
              underlineColorAndroid = 'transparent'
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
          </View>
          <View style={styles.posterButton}>
            { this.state.isPosting ?
              <ActivityIndicator size="small" color="#00ff00" /> : 
              <Icon onPress={() => this.showImagePicker()} name="md-camera" size={24}></Icon>
            }
          </View>
        </View>
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex: 5}}>
          </View>
          <View style={{flex: 1}}>
            <Button
              onPress={() => this.submitPost()} 
              title="Post"
              color="rgb(70, 144, 214)"
            />
          </View>
        </View>
        
        <View style={{flex:1}}>
          { this.state.hasAttachment ?
            <Image style={{height: 100}} source={{uri: this.state.postImageUri}}/> : <View></View>
          }
        </View>
      </View>
    );
  }

  showImagePicker = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      let stateSet = this.setState;
      if (response.didCancel) {
        alert('User cancelled image picker');
      }
      else if (response.error) {
        alert('ImagePicker Error: '+ response.error);
      }
      else if (response.customButton) {
        //do nothng but leave it for future
      }
      else {
        let source = { uri: response.uri };
        api.upload('api/v1/archive/image', {
          method: 'post',
          body: {
            uri: response.uri,
            type: response.type,
            name: response.fileName
          }
        }).then((res) => {
          alert(JSON.stringify(res))
          stateSet({attachment_guid : res.guid});
        }, (err) => alert(JSON.stringify(err)));
        
        this.setState({
          hasAttachment:true,
          postImageUri: 'data:image/jpeg;base64,' + response.data
        });

      }
    });

  }

  submitPost = () => {
    let newPost = {text: this.state.text}
    this.setState({
      isPosting: true,
    });
    post(newPost).then((data) => {
      this.setState({
        isPosting: false
      });
    })
    .catch(err => {
      console.log('error');
    })
  }
}

const styles = StyleSheet.create({
  poster: {
    flex:7,
    padding:4
  },
  posterWrapper: {
    flex:1,
    flexDirection: 'row',
  },
  posterButton: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    alignContent: 'center',
  },
  avatar: {
    flex:1
  }
});