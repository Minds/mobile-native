import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, Text,Button, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import NewsfeedList from './NewsfeedList';
import api from './../common/services/api.service';

import { post, remind, uploadAttachment } from './NewsfeedService';

import colors from '../styles/Colors';

import {
  NavigationActions
} from 'react-navigation';

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
    postImageUri: ''
  };

  render() {
    return (
      <View style={styles.posterAndPreviewWrapper}>
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
        
        <View style={{flex:5, flexDirection:'row'}}>
          { this.state.hasAttachment && this.state.postImageUri.length > 1 ?
            <Image style={{height: 100}} source={{uri: this.state.postImageUri}}/> : <View></View>
          } 
          { this.props.attachmentGuid && this.props.imageUri.length > 1 ?
            <Image
              source={{ uri : this.props.imageUri }}
              style={{flex:1}}
            /> : <View></View>
          } 
        </View>
      </View>
    );
  }

  showPostButton() {
    if(!this.props.isRemind && !this.props.attachmentGuid) {
      return  <View style={{flex:1, flexDirection: 'row'}}>
                <View style={{flex: 5}}>
                </View>
                <View style={{flex: 1}}>
                  <TouchableHighlight
                    onPress={() => this.submitPost()} 
                    underlayColor = 'transparent'
                    style = {styles.button}
                    accessibilityLabel="Subscribe to this channel"
                  >
                    <Text style={{color: colors.primary}} > POST </Text>
                  </TouchableHighlight>
                </View>
              </View>;
    }
  }

  showAttachmentIcon() {
    if(!this.props.isRemind && !this.props.attachmentGuid) {
      return <View style={styles.posterButton}>
                { this.state.isPosting ?
                  <ActivityIndicator size="small" color="#00ff00" /> : 
                  <Icon onPress={() => this.showImagePicker()} name="md-camera" size={24}></Icon>
                }
              </View>;
    } else if (this.props.isRemind){
      return  <View style={styles.posterButton}>
                { this.state.isPosting ?
                  <ActivityIndicator size="small" color="#00ff00" /> : 
                  <Icon onPress={() => this.remindPost()} name="md-send" size={24}></Icon>
                }
              </View>;
    } else if (this.props.attachmentGuid){
      return  <View style={styles.posterButton}>
                { this.state.isPosting ?
                  <ActivityIndicator size="small" color="#00ff00" /> : 
                  <Icon onPress={() => this.submitPost()} name="md-send" size={24}></Icon>
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
    if(this.state.hasAttachment && !(this.state.hasAttachment && this.state.attachmentGuid.length > 0)) {
      return false;
    }

    let newPost = {message: this.state.text}
    if(this.props.attachmentGuid) {
      newPost.attachment_guid = this.props.attachmentGuid;
    }
    if(this.state.attachmentGuid)
      newPost.attachment_guid = this.state.attachmentGuid;
    this.setState({
      isPosting: true,
    });
    
    post(newPost).then((data) => {
      if (this.props.reset) {
        this.props.reset();
      }
      NavigationActions.navigate({ routeName: 'Tabs' })
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
  },
  posterAndPreviewWrapper: {
    flex:1
  },
  button: {
    margin:4, 
    padding:5, 
    alignItems:'center', 
    borderRadius: 5,
    backgroundColor:'white', 
    borderWidth:1, 
    borderColor: 
    colors.primary
  }
});