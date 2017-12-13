import React, {
  Component
} from 'react';


import {
  MINDS_URI
} from '../config/Config';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View
} from 'react-native';


export default class Comment extends Component {

  state = {
    avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/' + 'icon/' + this.props.comment.ownerObj.guid }
  };

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.author}>
            <View style={{flex:1}}>
              <TouchableOpacity>
                <Image source={this.state.avatarSrc} style={styles.avatar}/>
              </TouchableOpacity>
            </View>
            <View style={{flex:6}}>
              <View style={{flex:4}}>
                <Text style={styles.username}> @{this.props.comment.ownerObj.username}</Text>
              </View>
              <View style={{flex:3}}>
                <Text style={styles.timestamp}> {this.formatDate(this.props.comment.time_created)}</Text>
              </View>
            </View>
            
          </View>
          <View style={styles.content}>
            <Text style={styles.message}>{this.props.comment.description}</Text>
          </View>
        </View>

    );
  }

  formatDate(timestamp) {
    const t = new Date(timestamp * 1000);
    return t.toDateString();
  }
}

const styles = StyleSheet.create({
  author: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8
  },
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  username: {
    fontWeight: 'bold',
  },
  message: {
    padding: 8,
    paddingLeft: 16
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
});