import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, Text,Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import NewsfeedList from './NewsfeedList';
import api from './../common/services/api.service';

import { post, remind, uploadAttachment } from './NewsfeedService';

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
    hasAttachment:false,
    attachmentGuid: '',
    attachmentDone: false,
  };

  render() {
    return (
      <View style={{height:80}}>
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
          { this.showAttachmentIcon() }
        </View>
        { this.showPostButton() }
        
        <View style={{flex:1}}>
          { this.state.hasAttachment ?
            <Image style={{height: 100}} source={{uri: this.state.postImageUri}}/> : <View></View>
          }
        </View>
      </View>
    );
  }

  showPostButton() {
    if(!this.props.isRemind) {
      return  <View style={{flex:1, flexDirection: 'row'}}>
                <View style={{flex: 5}}>
                </View>
                <View style={{flex: 1}}>
                  <Button
                    onPress={() => this.submitPost()} 
                    title="Post"
                    disabled={this.state.hasAttachment && !(this.state.hasAttachment && this.state.attachmentGuid.length > 0)}
                    color="rgb(70, 144, 214)"
                  />
                </View>
              </View> 
    }
  }

  showAttachmentIcon() {
    if(!this.props.isRemind) {
      return <View style={styles.posterButton}>
                { this.state.isPosting ?
                  <ActivityIndicator size="small" color="#00ff00" /> : 
                  <Icon onPress={() => this.showImagePicker()} name="md-camera" size={24}></Icon>
                }
              </View>;
    } else {
      return  <View style={styles.posterButton}>
                { this.state.isPosting ?
                  <ActivityIndicator size="small" color="#00ff00" /> : 
                  <Icon onPress={() => this.remindPost()} name="md-send" size={24}></Icon>
                }
              </View>;
    }
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
      if (response.didCancel) {
      }
      else if (response.error) {
        alert('ImagePicker Error: '+ response.error);
      }
      else if (response.customButton) {
        //do nothng but leave it for future
      }
      else {
        uploadAttachment('api/v1/archive/image', {
            uri: response.uri,
            type: response.type,
            name: response.fileName
        }).then((res) => {
          this.setState({ 
            attachmentGuid: res.guid,
            attachmentDone: true
          });
        });
        
        this.setState({
          hasAttachment:true,
          postImageUri: response.uri
        });

      }
    });

  }


  remindPost = () => {
    let newPost = {message: this.state.text}
    this.setState({
      isPosting: true,
    });
    
    remind(this.props.guid ,newPost).then((data) => {
      this.setState({
        isPosting: false,
        text: '',
        attachmentGuid: '',
        hasAttachment:false
      });
    })
    .catch(err => {
      console.log('error');
    });
  }

  submitPost = () => {
    let newPost = {message: this.state.text}
    if(this.state.attachmentGuid)
      newPost.attachment_guid = this.state.attachmentGuid
    this.setState({
      isPosting: true,
    });
    
    post(newPost).then((data) => {
      this.setState({
        isPosting: false,
        text: '',
        attachmentGuid: '',
        hasAttachment:false
      });
    })
    .catch(err => {
      console.log('error');
    });
  }
}

const styles = StyleSheet.create({
  poster: {
    flex:7,
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