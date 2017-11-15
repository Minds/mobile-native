import React, {
  Component
} from 'react';

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

import {
  MINDS_URI,
} from '../../config/Config';

import CommentView from './view/CommentView';

export default class Notification extends Component<{}> {

  state = {
    avatarSrc: { uri: MINDS_URI + 'icon/' + this.props.entity.owner_guid }
  };

  render() {

    let body;
    const entity = this.props.entity;

    switch (entity.notification_view) {

      case "friends":
        break;
      case "group_invite":
        break;
      case "group_kick":
        break;
      case "group_activity":
        body = (
          <View style={styles.bodyContents}>
            <Text style={styles.link}>{entity.fromObj.name}</Text>
            <Text> posted in </Text>
            <Text style={styles.link}>{entity.params.group.name}</Text>
          </View>
        )
        break;
      case "comment":
        body = <CommentView entity={entity} />
        break;
      default:
        body = (
          <View style={styles.bodyContents}>
            <Text>Could not load notification</Text>
          </View>
        )
    }

    return (  
        <View style={styles.container}>
          <Image source={this.state.avatarSrc} style={styles.avatar}/>
          <View style={styles.body}>

            { body }

            <Text style={styles.timestamp}>{this.formatDate(this.props.entity.time_created)}</Text>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  bodyContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});