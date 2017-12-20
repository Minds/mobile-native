import React, {
  Component
} from 'react';

import { Icon } from 'react-native-elements'

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  View
} from 'react-native';

import { observer, inject } from 'mobx-react/native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../../config/Config';

import { thumbActivity } from './ActionsService';
import Remind from './remind/Remind';

@inject('newsfeed')
@inject('user')
@observer
export default class Actions extends Component {

  state = {
    loading: false,
    avatarSrc: { uri: MINDS_URI + 'icon/' },
    votedDown: false,
    votedUp: false,
    votedDownCount: 0,
    votedUpCount: 0,
    remindModalVisible: false,
  };

  componentWillMount() {
    let votedUp = false;
    let votedDown = false;
    let votedUpCount = 0;
    let votedDownCount = 0;

    if(this.props.entity['thumbs:up:user_guids'] && this.props.entity['thumbs:up:user_guids'].indexOf(this.props.user.me.guid) >= 0){
      votedUp = true;
      votedUpCount = parseInt(this.props.entity['thumbs:up:count']);
    }
    if(this.props.entity['thumbs:down:user_guids'] && this.props.entity['thumbs:down:user_guids'].indexOf(this.props.user.me.guid) >= 0){
      votedDown = true;
      votedDownCount = parseInt(this.props.entity['thumbs:down:count']);
    }

    this.setState({
      votedDown,
      votedUp,
      votedDownCount,
      votedUpCount
    })
  }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.container}>
          <View style={styles.actionIconWrapper}>
            <Icon onPress={this.toggleThumb.bind(this, 'thumbs:up')} color={this.state.votedUp ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'}  name='thumb-up' size={20} />
            <Text style={styles.actionIconText}>{this.state.votedUpCount > 0 ? this.state.votedUpCount : ''}</Text>
          </View>
          <View style={styles.actionIconWrapper}>
            <Icon onPress={this.toggleThumb.bind(this, 'thumbs:down')} color={this.state.votedDown ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'}  name='thumb-down' size={20} />
            <Text style={styles.actionIconText}>{this.state.votedDownCount > 0 ? this.state.votedDownCount : ''}</Text>
          </View>
          <View style={styles.actionWireIconWrapper}>
            <IonIcon color='rgb(70, 144, 214)' name='ios-flash' size={40} onPress={this.openWire}/>
          </View>
          <View style={styles.actionIconWrapper}>
            <Icon style={styles.actionIcon} color={this.props.entity['comments:count'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='chat-bubble' size={20} onPress={this.openComments} />
            <Text style={styles.actionIconText}>{this.props.entity['comments:count'] > 0 ? this.props.entity['comments:count']: ''}</Text>
          </View>
          <View onPress={this.remind} style={styles.actionIconWrapper}>
            <Icon onPress={this.remind} color={this.props.entity['reminds'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='repeat' size={20}/>
            <Text onPress={this.remind} style={styles.actionIconText}>{this.props.entity['reminds'] > 0 ? this.props.entity['reminds']: ''}</Text>
          </View>
        </View>
        <View style = {styles.modalContainer}>
          <Modal animationType = {"slide"} transparent = {false}
            visible = {this.state.remindModalVisible}
            onRequestClose={this.closeRemind}>
            <View style = {styles.modal}>
              <View style = {styles.modalHeader}>
                <IonIcon onPress={this.closeRemind} color='gray' size={30} name='md-close' />
              </View>
              <Remind entity={this.props.entity}/>
            </View>
          </Modal>
        </View>
      </View>
    );
  }

  openComments = () => {
    this.props.navigation.navigate('Comments', { entity: this.props.entity});
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.entity.ownerObj});
  }

  toggleThumb = (direction) => {
    if(direction == 'thumbs:up') {
      this.setState({
        votedUp : !this.state.votedUp,
        votedUpCount: this.state.votedUp? this.state.votedUpCount-1: this.state.votedUpCount+1})
    } else {
      this.setState({
        votedDown : !this.state.votedDown,
        votedDownCount: this.state.votedDown? this.state.votedDownCount-1: this.state.votedDownCount+1})
    }

    let arr = direction.split(':');

    thumbActivity(this.props.entity.guid, arr[1]).then((data) => {}).catch(err => {
        alert(err);
        if(direction == 'thumbs:up') {
          this.setState({
            votedUp : !this.state.votedUp,
            votedUpCount: this.state.votedUp? this.state.votedUpCount-1: this.state.votedUpCount+1})
        } else {
          this.setState({
            votedDown : !this.state.votedDown,
            votedDownCount: this.state.votedDown? this.state.votedDownCount-1: this.state.votedDownCount+1})
        }
      })
  }

  hasThumbedActivity = (direction) => {
    let guids = direction == 'up' ? this.props.entity['thumbs:up:user_guids'] : this.props.entity['thumbs:down:user_guids'];
    if (guids && guids.length > 0 && guids.indexOf(this.props.user.me.guid) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  closeRemind = () => {
    this.setState({ remindModalVisible: false });
  }

  remind = () => {
    this.setState({ remindModalVisible: true });
  }

}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  actionIconWrapper: {
    flex: 1,
  },
  actionWireIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  actionIconText: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 52,
    alignContent: 'center',
    justifyContent: 'center'
  },
  modal: {
    flex:1,
    paddingTop: 4,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  }
});