//@ts-nocheck
import React, { Component } from 'react';

import { Icon } from 'react-native-elements';

import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { observer, inject } from 'mobx-react';

import IonIcon from 'react-native-vector-icons/Ionicons';

import { ComponentsStyle } from '../styles/Components';
import token from '../common/helpers/token';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';

@inject('user', 'boost')
@observer
export default class BoostActionBar extends Component {
  render() {
    let actions = null;
    if (this.props.entity.currency !== 'tokens') actions = this.renderActions();
    return (
      <View style={styles.container}>
        {this.renderTarget()}
        {this.renderViews()}
        {this.renderBid()}
        {this.renderStatus()}
        {actions}
      </View>
    );
  }

  renderTarget() {
    return this.props.entity.destination ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="target">
        <IonIcon
          color="rgb(96, 125, 139)"
          name="md-person"
          size={20}
          style={styles.icon}
        />
        <MText style={styles.value} numberOfLines={1}>
          {'@' + this.props.entity.destination.username}
        </MText>
      </View>
    ) : (
      <View></View>
    );
  }

  renderViews() {
    return this.props.entity.impressions ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="views">
        <Icon
          color="rgb(96, 125, 139)"
          type="material-community"
          name="eye"
          size={20}
          style={styles.icon}
        />
        <MText style={styles.value}>
          {this.props.entity.impressions + ' views'}
        </MText>
      </View>
    ) : (
      <View />
    );
  }

  renderStatus() {
    return this.props.entity.state ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="status">
        <Icon
          type="material-community"
          color="rgb(96, 125, 139)"
          name="clock"
          size={20}
          style={styles.icon}
        />
        <MText style={styles.value}>{this.props.entity.state}</MText>
      </View>
    ) : (
      <View />
    );
  }

  renderBid() {
    return this.props.entity.bid ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="bid">
        <Icon
          type="material-community"
          color="rgb(96, 125, 139)"
          name="bank"
          size={20}
          style={styles.icon}
        />
        <MText style={styles.value}>
          {(this.props.entity.bidType == 'offchain' ||
            this.props.entity.bidType == 'onchain' ||
            this.props.entity.bidType == 'peer' ||
            this.props.entity.bidType == 'tokens') &&
            token(this.props.entity.bid, 18) + ' Tokens'}
          {(this.props.entity.bidType == 'usd' ||
            this.props.entity.bidType == 'money') &&
            '$' + (this.props.entity.bid / 100).toFixed(2)}
          {this.props.entity.bidType == 'points' &&
            this.props.entity.bid + ' points'}
        </MText>
      </View>
    ) : (
      <View></View>
    );
  }

  renderScheduled() {
    return this.props.entity.scheduledTs ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="schedule">
        <Icon
          type="material-community"
          color="rgb(96, 125, 139)"
          name="alarm"
          size={20}
          style={styles.icon}
        />
        <MText style={styles.value}>
          {i18n.date(this.props.entity.scheduledTs * 1000)}
        </MText>
      </View>
    ) : (
      <View style={ThemedStyles.style.flexColumnCentered} key="schedule">
        <Icon
          type="material-community"
          color="rgb(96, 125, 139)"
          name="clock"
          size={20}
          style={styles.icon}
        />
        <MText style={styles.value}>
          {i18n.date(this.props.entity.time_created * 1000, 'datetime')}
        </MText>
      </View>
    );
  }

  renderActions() {
    let buttons = [];
    if (this.canRevoke()) {
      buttons.push(
        <View style={ThemedStyles.style.flexColumnCentered} key="revoke">
          <TouchableHighlight
            onPress={() => {
              this.props.entity.revoke(this.props.boost.filter);
            }}
            underlayColor="transparent"
            style={ComponentsStyle.redbutton}
          >
            <MText style={ThemedStyles.style.colorAlert}>
              {' '}
              {i18n.t('revoke').toUpperCase()}{' '}
            </MText>
          </TouchableHighlight>
        </View>,
      );
    }

    if (this.canReject()) {
      buttons.push(
        <View style={ThemedStyles.style.flexColumnCentered} key="reject">
          <TouchableHighlight
            onPress={() => {
              this.props.entity.reject();
            }}
            underlayColor="transparent"
            style={ComponentsStyle.redbutton}
          >
            <MText
              style={ThemedStyles.style.colorAlert}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {' '}
              {i18n.t('reject').toUpperCase()}{' '}
            </MText>
          </TouchableHighlight>
        </View>,
      );
    }

    if (this.canAccept()) {
      buttons.push(
        <View style={ThemedStyles.style.flexColumnCentered} key="accept">
          <TouchableHighlight
            onPress={() => {
              this.props.entity.accept();
            }}
            underlayColor="transparent"
            style={ComponentsStyle.bluebutton}
          >
            <MText
              style={ThemedStyles.style.colorLink}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {' '}
              {i18n.t('accept').toUpperCase()}{' '}
            </MText>
          </TouchableHighlight>
        </View>,
      );
    }

    return buttons;
  }

  canReject() {
    return (
      this.props.entity.state === 'created' &&
      this.getBoostType(this.props.entity) === 'p2p' &&
      this.isIncoming(this.props.entity)
    );
  }

  canRevoke() {
    return (
      this.props.entity.state === 'created' &&
      ((this.getBoostType(this.props.entity) === 'p2p' &&
        !this.isIncoming(this.props.entity)) ||
        this.getBoostType(this.props.entity) !== 'p2p')
    );
  }

  canAccept() {
    return (
      this.props.entity.state === 'created' &&
      this.getBoostType(this.props.entity) === 'p2p' &&
      this.isIncoming(this.props.entity)
    );
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
  },
});
