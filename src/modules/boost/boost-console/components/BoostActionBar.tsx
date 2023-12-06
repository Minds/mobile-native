import { inject, observer } from 'mobx-react';
import React, { Component, ReactElement } from 'react';
import { TouchableHighlight, View } from 'react-native';
import IonIcon from '@expo/vector-icons/Ionicons';
import MCIcon from '@expo/vector-icons/MaterialCommunityIcons';
import type UserStore from '~/auth/UserStore';
import MText from '~/common/components/MText';
import token from '~/common/helpers/token';
import i18n from '~/common/services/i18n.service';
import { ComponentsStyle } from '~/styles/Components';
import ThemedStyles from '~/styles/ThemedStyles';
import type BoostModel from '../../models/BoostModel';
import { BoostConsoleStoreContext } from '../contexts/boost-store.context';

type PropsType = {
  boost: BoostModel;
  user?: UserStore;
};

@inject('user')
@observer
export default class BoostActionBar extends Component<PropsType> {
  static contextType = BoostConsoleStoreContext;
  declare context: React.ContextType<typeof BoostConsoleStoreContext>;

  render() {
    let actions: ReactElement[] | null = null;
    if (this.props.boost.currency !== 'tokens') {
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
      parseInt(this.props.boost.time_created, 10) * 1000,
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
    return this.props.boost.destination ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="target">
        <IonIcon name="md-person" size={20} style={styles.icon} />
        <MText style={styles.value} numberOfLines={1}>
          {'@' + this.props.boost.destination.username}
        </MText>
      </View>
    ) : null;
  }

  renderViews() {
    return this.props.boost.impressions ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="views">
        <MCIcon name="eye" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {this.props.boost.impressions + ' views'}
        </MText>
      </View>
    ) : null;
  }

  renderStatus() {
    return this.props.boost.state ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="status">
        <MCIcon name="timer-sand-empty" size={20} style={styles.icon} />
        <MText style={styles.value}>{this.props.boost.state}</MText>
      </View>
    ) : null;
  }

  renderBid() {
    return this.props.boost.bid ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="bid">
        <MCIcon name="bank" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {['offchain', 'onchain', 'peer', 'tokens'].includes(
            this.props.boost.bidType,
          ) && token(this.props.boost.bid, 18) + ' Tokens'}
          {['usd', 'money'].includes(this.props.boost.bidType) &&
            '$' + (this.props.boost.bid / 100).toFixed(2)}
          {this.props.boost.bidType === 'points' &&
            this.props.boost.bid + ' points'}
        </MText>
      </View>
    ) : null;
  }

  renderScheduled() {
    return this.props.boost.scheduledTs ? (
      <View style={ThemedStyles.style.flexColumnCentered} key="schedule">
        <MCIcon name="alarm" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {i18n.date(this.props.boost.scheduledTs * 1000)}
        </MText>
      </View>
    ) : (
      <View style={ThemedStyles.style.flexColumnCentered} key="schedule">
        <MCIcon name="clock" size={20} style={styles.icon} />
        <MText style={styles.value}>
          {i18n.date(
            parseInt(this.props.boost.time_created, 10) * 1000,
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
              this.props.boost.revoke();
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
              this.props.boost.reject();
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
              this.props.boost.accept();
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
      this.props.boost.state === 'created' &&
      this.getBoostType(this.props.boost) === 'p2p' &&
      this.isIncoming(this.props.boost)
    );
  }

  canRevoke() {
    return (
      this.props.boost.state === 'created' &&
      ((this.getBoostType(this.props.boost) === 'p2p' &&
        !this.isIncoming(this.props.boost)) ||
        this.getBoostType(this.props.boost) !== 'p2p')
    );
  }

  canAccept() {
    return (
      this.props.boost.state === 'created' &&
      this.getBoostType(this.props.boost) === 'p2p' &&
      this.isIncoming(this.props.boost)
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

  isIncoming(boost: BoostModel) {
    return boost.destination.guid === this.props.user?.me.guid;
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
