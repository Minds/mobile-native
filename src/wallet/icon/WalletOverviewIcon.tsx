//@ts-nocheck
//@ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, View, Image } from 'react-native';

import { CommonStyle } from '../../styles/Common';
import FastImage from 'react-native-fast-image';
import { observer } from 'mobx-react';

export const Icons = {
  votes: {
    asset: require('../../assets/contributions/votes.png'),
    title: 'Votes',
    score: '+1',
    overview: 'votes',
  },
  comments: {
    asset: require('../../assets/contributions/comments.png'),
    title: 'Comments',
    score: '+2',
    overview: 'comments',
  },
  subscribers: {
    asset: require('../../assets/contributions/subscribers.png'),
    title: 'Subscribers',
    score: '+4',
    overview: 'subscribers',
  },
  reminds: {
    asset: require('../../assets/contributions/reminds.png'),
    title: 'Reminds',
    score: '+4',
    overview: 'reminds',
  },
  referrals: {
    asset: require('../../assets/contributions/referrals.png'),
    title: 'Referrals',
    score: '+10',
    overview: 'referrals',
  },
  onchain_transactions: {
    asset: require('../../assets/contributions/onchain-transactions.png'),
    title: 'OnChain',
    score: '+10 (receiver)',
  },
  checkins: {
    asset: require('../../assets/contributions/checkins.png'),
    title: 'Check-ins',
    score: '+2',
    overview: 'checkin',
  },
  development: {
    asset: require('../../assets/contributions/code.png'),
    title: 'Development',
    score: 'Manually reviewed',
  },
};
/**
 * Custom Button component
 */
@observer
export default class WalletOverviewIcon extends Component {
  /**
   * Default props
   */
  static defaultProps = {
    icon: {
      asset: '',
      title: '',
      score: '',
      overview: '',
    },
    overview: {},
  };

  /**
   * Prop types
   */
  static propTypes = {
    icon: PropTypes.object.isRequired,
  };

  /**
   * Render
   */
  render() {
    if (typeof this.props.overview.contributionValues !== 'undefined') {
      this.props.icon.score =
        '+' +
        this.props.overview.contributionValues[
          this.props.icon.overview
        ].toPrecision(3);
    }
    const { icon } = this.props;

    return (
      <View underlayColor="transparent" style={styles.container}>
        <Image
          resizeMode={'contain'}
          style={styles.image}
          source={icon.asset}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, CommonStyle.fontM]}> {icon.title} </Text>
          <Text style={[styles.score, CommonStyle.fontS]}> {icon.score} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 8,
    paddingBottom: 8,
    width: 150,
  },
  textContainer: {
    paddingLeft: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  image: {
    width: 32,
    height: 32,
  },
  title: {},
  score: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
