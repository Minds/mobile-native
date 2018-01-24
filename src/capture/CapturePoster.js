import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, Text,Button, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import api from './../common/services/api.service';
import * as Progress from 'react-native-progress';

import { post, uploadAttachment } from './CaptureService';

import colors from '../styles/Colors';

import CaptureGallery from './CaptureGallery';
import CaptureTabs from './CaptureTabs';
import CapturePreview from './CapturePreview';

import {
  NavigationActions
} from 'react-navigation';

@inject('user')
@observer
export default class CapturePoster extends Component {

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
          <TextInput
            style={styles.poster}
            editable = {true}
            placeholder = 'Speak your mind...'
            placeholderTextColor = '#ccc'
            underlineColorAndroid = 'transparent'
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />

          <View style={styles.posterActions}>
            { 
            this.state.hasAttachment && !this.state.attachmentGuid ? 
              <Progress.Pie progress={this.state.progress} size={36}/>
            :
              <TouchableHighlight 
                underlayColor='#FFF' 
                onPress={() => this.submit()}
                style={styles.button}
              >
                <Text style={styles.buttonText}>POST</Text>
              </TouchableHighlight>
            }
          </View>
        </View>

        { 
          this.state.hasAttachment ? 
            <View style={ styles.preview }>
              
              <CapturePreview
                uri={this.state.attachmentUri}
                type={this.state.attachmentType}
                />

              <Icon name="md-close" size={36} style={ styles.deleteAttachment } onPress={() => this.deleteAttachment() }/>
            </View>
            : null 
        }

        <CaptureGallery 
          style={{ flex: 1 }} 
          onSelected={ this.onAttachedMedia.bind(this) }
          />
    
      </View>
    );
  }

  showPostButton() {
      return  
        <View style={{flex:1, flexDirection: 'row'}}>
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

  async onAttachedMedia(response) {

    if (response.didCancel) {
    }
    else if (response.error) {
      alert('ImagePicker Error: '+ response.error);
    }
    else if (response.customButton) {
      //do nothng but leave it for future
    }
    else {

      this.setState({
        hasAttachment:true,
        attachmentUri: response.uri,
        attachmentType: response.type,
      });

      let res;

      try {
        res = await uploadAttachment('api/v1/archive/image', {
            uri: response.uri,
            type: response.type,
            name: response.fileName || 'test.jpg'
        }, 
        (e) => {
          let pct = e.loaded / e.total;

          this.setState({
            'progress': pct
          });
        });

      } catch (e) {
        alert(JSON.stringify(e));
        alert('caught upload error');
        throw e;
      }

      if (!res) 
        return;

      this.setState({ 
        attachmentGuid: res.guid,
        attachmentDone: true
      });  

    }

  }

  async deleteAttachment() {
    //TODO: delete from server side

    this.setState({
      attachmentGuid: '',
      hasAttachment: false,
    });
  }

  async submit() {
    if (this.state.hasAttachment && !(this.state.hasAttachment && this.state.attachmentGuid.length > 0)) {
      alert('Please try again in a moment.');
      return false;
    }

    if (!this.state.hasAttachment && !this.state.text) {
      alert('Nothing to post...');
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
    
    try { 
      let response = await post(newPost);

      if (this.props.reset) {
        this.props.reset();
      }

      this.props.onComplete(response.entity);

      this.setState({
        isPosting: false,
        text: '',
        attachmentGuid: '',
        hasAttachment:false
      });

    } catch (e) {
      console.log('error', e);
      alert('Oooppppss. Looks like there was an error.');
    }
  
  }
}

const styles = StyleSheet.create({
  posterAndPreviewWrapper: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  posterWrapper: {
    padding: 16,
    minHeight: 100,
    flexDirection: 'row',
  },
  poster: {
    flex:1,
  },
  posterActions: {
    alignItems: 'center', 
    justifyContent: 'center',
    alignContent: 'center',
  },
  posterButton: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    alignContent: 'center',
  },
  preview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  avatar: {
    flex:1,
  },
  gallery: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  button: {
    margin: 4, 
    padding: 8, 
    paddingLeft: 16,
    paddingRight: 16,
    alignItems:'center', 
    borderRadius: 3,
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
  },
  deleteAttachment: {
    position: 'absolute',
    right: 8,
    top: 0,
    color: '#FFF'
  }
});