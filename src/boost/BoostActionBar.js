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
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  View
} from 'react-native';
import formatDate from '../common/helpers/date';

import { observer, inject } from 'mobx-react/native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import token from '../common/helpers/token';

import {
  MINDS_URI
} from '../config/Config';

@inject('boost')
@inject('user')
@observer
export default class BoostActionBar extends Component {

  state = {
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderTarget()}
        {this.renderViews()}
        {this.renderBid()}
        {this.renderStatus()}
        {this.renderActions()}
      </View>
    );
  }

  renderTarget() {
    return  this.props.entity.destination ?
              <View style={CommonStyle.flexColumnCentered} key="target">
                <IonIcon 
                  color='rgb(96, 125, 139)'
                  name='md-person'
                  size={20}
                  style={styles.icon}
                  />
                <Text style={styles.value}>
                  { '@' + this.props.entity.destination.username}
                </Text>
              </View> : <View></View>;
  }

  renderViews() {
    return  this.props.entity.impressions ?
              <View style={CommonStyle.flexColumnCentered} key="views">
                <Icon
                  color='rgb(96, 125, 139)'
                  type="material-community"
                  name='eye'
                  size={20}
                  style={styles.icon}
                  />
                <Text style={styles.value}>
                  {this.props.entity.impressions + ' views'}
                </Text>
              </View> : <View></View>;
  }

  renderStatus() {
    return  this.props.entity.state ?
              <View style={CommonStyle.flexColumnCentered} key="status">
                <Icon
                  type='material-community'
                  color='rgb(96, 125, 139)'
                  name='clock'
                  size={20}
                  style={styles.icon}
                  />
                <Text style={styles.value}>
                  {this.props.entity.state}
                </Text>
              </View> : <View></View>;
  }

  renderBid() {
    return  this.props.entity.bid ?
              <View style={CommonStyle.flexColumnCentered} key="bid">
                <Icon
                  type='material-community'
                  color='rgb(96, 125, 139)' 
                  name='bank'
                  size={20}
                  style={styles.icon}
                  />
                <Text style={styles.value}>
                  {token(this.props.entity.bid, 18) + ' Tokens'}
                </Text>
              </View> : <View></View>;
  }

  renderScheduled() {
    return  this.props.entity.scheduledTs ?
              <View style={CommonStyle.flexColumnCentered} key="schedule">
                <Icon 
                  type='material-community'
                  color='rgb(96, 125, 139)'
                  name='alarm'
                  size={20}
                  style={styles.icon}
                  />
                <Text style={styles.value}>
                  {formatDate(this.props.entity.scheduledTs)}
                </Text>
              </View> : 
              <View style={CommonStyle.flexColumnCentered} key="schedule">
                <Icon
                  type='material-community'
                  color='rgb(96, 125, 139)'
                  name='clock'
                  size={20}
                  style={styles.icon}
                  />
                <Text
                  style={styles.value}>
                  {formatDate(this.props.entity.time_created, 'd-m-Y')}
                </Text>
              </View>;
  }

  renderActions() {
    let buttons = []
    if(this.canRevoke()){
      buttons.push(
        <View style={CommonStyle.flexColumnCentered} key="revoke">
          <TouchableHighlight
            onPress={() => { this.props.boost.list.revoke(this.props.entity.guid, this.props.boost.filter)}} 
            underlayColor = 'transparent'
            style = {ComponentsStyle.redbutton}
          >
            <Text style={{color: colors.danger}} > REVOKE </Text>
          </TouchableHighlight>
        </View>
      );
    };
    
    if (this.canReject()){
      buttons.push(
        <View style={CommonStyle.flexColumnCentered} key="reject">
          <TouchableHighlight
            onPress={() => { this.props.boost.list.reject(this.props.entity.guid)}}
            underlayColor = 'transparent'
            style = {ComponentsStyle.redbutton}
          >
            <Text style={{color: colors.danger}} > REJECT </Text>
          </TouchableHighlight>
        </View>
      );
    } 
    
    if (this.canAccept()) {
      buttons.push(
        <View style={CommonStyle.flexColumnCentered} key="accept">
          <TouchableHighlight
            onPress={() => { this.props.boost.list.accept(this.props.entity.guid)}}
            underlayColor = 'transparent'
            style = {ComponentsStyle.bluebutton}
          >
            <Text style={{color: colors.primary}} > ACCEPT </Text>
          </TouchableHighlight>
        </View>
      );
    }

    return buttons;
  }

  canReject() {
    return this.props.entity.state === 'created' && this.getBoostType(this.props.entity) === 'p2p' && this.isIncoming(this.props.entity);
  }

  canRevoke() {
    return this.props.entity.state === 'created' && (
      (this.getBoostType(this.props.entity) === 'p2p' && !this.isIncoming(this.props.entity)) ||
      (this.getBoostType(this.props.entity) !== 'p2p')
    );
  }

  canAccept() {
    return this.props.entity.state === 'created' && this.getBoostType(this.props.entity) === 'p2p' && this.isIncoming(this.props.entity);
  }

  getBoostType(boost) {
    if (boost.handler) {
      return boost.handler;
    } else if (boost.destination) {
      return 'p2p';
    }

    return false;
  }

  isIncoming(boost) {
    return boost.destination.guid === this.props.user.me.guid;
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 4,
  },
  icon: {
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
    marginTop: 4,
  }
});