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
import formatDate from '../common/helpers/date';

import { observer, inject } from 'mobx-react/native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../config/Config';


@inject('user')
@observer
export default class BoostActionBar extends Component {

  state = {
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderViews()}
        {this.renderBid()}
        {this.renderStatus()}
        {this.renderScheduled()}
        {this.renderActions()}
      </View>
    );
  }

  renderViews() {
    return  this.props.entity.impressions ?
              <View style={styles.actionIconWrapper}>
                <IonIcon color='rgb(96, 125, 139)'  name='md-eye' size={20} />
                <Text style={styles.actionIconText}>{this.props.entity.impressions}</Text>
              </View> : <View></View>;
  }

  renderStatus() {
    return  this.props.entity.state ?
              <View style={styles.actionIconWrapper}>
                <Icon  type='material-community' color='rgb(96, 125, 139)'  name='clock' size={20} />
                <Text style={styles.actionIconText}>{this.props.entity.state}</Text>
              </View> : <View></View>;
  }

  renderBid() {
    return  this.props.entity.bid ?
              <View style={styles.actionIconWrapper}>
                <Icon  type='material-community' color='rgb(96, 125, 139)'  name='bank' size={20} />
                <Text style={styles.actionIconText}>{this.props.entity.bid}</Text>
              </View> : <View></View>;
  }

  renderScheduled() {
    return  this.props.entity.scheduledTs ?
              <View style={styles.actionIconWrapper}>
                <Icon  type='material-community' color='rgb(96, 125, 139)'  name='alarm' size={20} />
                <Text style={styles.actionIconText}>{this.props.entity.scheduledTs}</Text>
              </View> : 
              <View style={styles.actionIconWrapper}>
                <Icon  type='material-community' color='rgb(96, 125, 139)'  name='clock' size={20} />
                <Text style={styles.actionIconText}>{formatDate(this.props.entity.time_created)}</Text>
              </View>;
  }

  renderActions() {
    let buttons = []
    if(this.canRevoke()){
      buttons.push(
        <Button
          onPress={() => { this.revoke() }}
          title="Revoke"
          color="red"
          accessibilityLabel="Revoke this boost"
        />
      );
    };
    
    if (this.canReject()){
      buttons.push(
        <Button
          onPress={() => { this.reject() }}
          title="Reject"
          color="red"
          accessibilityLabel="Reject this boost"
        />
      );
    } 
    
    if (this.canAccept()) {
      buttons.push(
        <Button
          onPress={() => { this.accept() }}
          title="Accept"
          color="#4791d6"
          accessibilityLabel="Accept this boost"
        />
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
    alignItems: 'center',
    padding: 4
  },
  actionIconWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
});