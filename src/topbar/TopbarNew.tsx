//@ts-nocheck
import React, { Component } from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';

import { observer, inject } from 'mobx-react';

import SearchComponent from './SearchComponent';
import navigation from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import MessengerTabIcon from '../messenger/MessengerTabIconNew';

import EmailConfirmation from './EmailConfirmation';
import BannerInfo from './BannerInfo';

@inject('user')
@inject('wallet')
@observer
class TopbarNew extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  listenForSearch = () => (this.props.user.searching ? styles.scale0 : {});

  render() {
    const CS = ThemedStyles.style;

    return (
      <SafeAreaConsumer>
        {insets => (
          <View>
            <View
              style={[
                styles.container,
                CS.backgroundPrimary,
                { paddingTop: insets.top + 10 },
              ]}>
              <View style={styles.topbar}>
                <View style={[styles.topbarLeft, CS.marginLeft4x]}>
                  <Text
                    style={[
                      CS.titleText,
                      CS.colorPrimaryText,
                      styles.lineHeight0,
                    ]}
                    onPress={this.props.refreshFeed ?? (() => false)}>
                    {this.props.title}
                  </Text>
                </View>
                <View style={styles.topbarRight}>
                  <MessengerTabIcon navigation={navigation} />
                  <SearchComponent
                    user={this.props.user}
                    navigation={this.props.navigation}
                  />
                </View>
              </View>
            </View>

            <EmailConfirmation user={this.props.user} />
            <BannerInfo user={this.props.user} />
          </View>
        )}
      </SafeAreaConsumer>
    );
  }
}

export default TopbarNew;

let topbarHeight = 50;

if (Platform.OS === 'ios') {
  topbarHeight = 90;
}

const styles = StyleSheet.create({
  lineHeight0: {
    lineHeight: 28,
  },
  container: {
    height: topbarHeight,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 8,
  },
  topbar: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  topbarLeft: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  topbarRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 4,
    marginRight: 5,
    paddingTop: 4,
  },
  button: {
    paddingHorizontal: 8,
  },
  scale0: {
    transform: [{ scale: 0 }],
  },
});
