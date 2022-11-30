import React, { Component, ReactElement } from 'react';

import { TouchableHighlight, View } from 'react-native';

import { observer, inject } from 'mobx-react';

import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ComponentsStyle } from '../styles/Components';
import token from '../common/helpers/token';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';
import type BoostModel from './BoostModel';
import type BoostStore from './BoostStore';
import type UserStore from '~/auth/UserStore';

type PropsType = {
  entity: BoostModel;
  boost: BoostStore;
  user: UserStore;
};

@inject('user', 'boost')
@observer
export default class BoostActionBar extends Component<PropsType> {
  render() {
    let actions: ReactElement[] | null = null;
    if (this.props.entity.currency !== 'tokens') {
      actions = this.renderActions();
    }
    return (
      <View style={styles.container}>
        {this.renderTarget()}
        {this.renderViews()}
        {this.renderBid()}
        {this.renderStatus()}
        {this.renderTime()}
        {actions}
      </View>
    );
  }

  renderTime() {
    const date = i18n.date(
      parseInt(this.props.entity.time_created, 10) * 1000,
      'friendly',
    );
    return (
      <View style={ThemedStyles.style.flexColumnCentered} key="time">
        <MCIcon name="clock" size={20} style={styles.icon} />
        <MText style={styles.value} numberOfLines={1}>
          {date}
        </MText>
      </View>
    );
  }

  renderTarget() {
    return this.props.entity.destination ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="target">
        <IonIcon name="md-person" size={20} style={styles.icon} />
        <MText style={styles.value} numberOfLines={1}>
          {'@' + this.props.entity.destination.username}
        </MText>
      </View>
    ) : null;
  }

  renderViews() {
    return this.props.entity.impressions ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="views">
        <MCIcon name="eye" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {this.props.entity.impressions + ' views'}
        </MText>
      </View>
    ) : null;
  }

  renderStatus() {
    return this.props.entity.state ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="status">
        <MCIcon name="timer-sand-empty" size={20} style={styles.icon} />
        <MText style={styles.value}>{this.props.entity.state}</MText>
      </View>
    ) : null;
  }

  renderBid() {
    return this.props.entity.bid ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="bid">
        <MCIcon name="bank" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {['offchain', 'onchain', 'peer', 'tokens'].includes(
            this.props.entity.bidType,
          ) && token(this.props.entity.bid, 18) + ' Tokens'}
          {['usd', 'money'].includes(this.props.entity.bidType) &&
            '$' + (this.props.entity.bid / 100).toFixed(2)}
          {this.props.entity.bidType === 'points' &&
            this.props.entity.bid + ' points'}
        </MText>
      </View>
    ) : null;
  }

  renderScheduled() {
    return this.props.entity.scheduledTs ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="schedule">
        <MCIcon name="alarm" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {i18n.date(this.props.entity.scheduledTs * 1000)}
        </MText>
      </View>
    ) : (
      <View style={ThemedStyles.style.flexColumnCentered} key="schedule">
        <MCIcon name="clock" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {i18n.date(
            parseInt(this.props.entity.time_created, 10) * 1000,
            'datetime',
          )}
        </MText>
      </View>
    );
  }

  renderActions() {
    let buttons: ReactElement[] = [];
    if (this.canRevoke()) {
      buttons.push(
        <View style={ThemedStyles.style.flexColumnCentered} key="revoke">
          <TouchableHighlight
            onPress={() => {
              this.props.entity.revoke(this.props.boost.filter);
            }}
            underlayColor="transparent"
            style={ComponentsStyle.redbutton}>
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
            style={ComponentsStyle.redbutton}>
            <MText
              style={ThemedStyles.style.colorAlert}
              adjustsFontSizeToFit
              numberOfLines={1}>
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
            style={ComponentsStyle.bluebutton}>
            <MText
              style={ThemedStyles.style.colorLink}
              adjustsFontSizeToFit
              numberOfLines={1}>
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

const styles = ThemedStyles.create({
  container: [
    'bcolorBaseBackground',
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      padding: 4,
      paddingBottom: 16,
    },
  ],
  icon: ['marginBottom', 'colorSecondaryText'],
  value: {
    fontSize: 11,
    marginTop: 4,
  },
});
