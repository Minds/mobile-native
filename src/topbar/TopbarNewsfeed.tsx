//@ts-nocheck
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import SearchComponent from './SearchComponent';
import navigation from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import MessengerTabIcon from '../messenger/MessengerTabIconNew';
import EmailConfirmation from './EmailConfirmation';
import BannerInfo from './BannerInfo';

type PropsType = {
  title: string;
  navigation: any;
  refreshFeed: Function;
};

@inject('user')
@inject('wallet')
@observer
class TopbarNewsfeed extends Component<PropsType> {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  listenForSearch = () => (this.props.user.searching ? styles.scale0 : {});

  render() {
    const CS = ThemedStyles.style;

    const logo = require('./../assets/logos/bulb.png');
    const refreshFeed = this.props.refreshFeed ?? (() => false);
    return (
      <SafeAreaConsumer>
        {(insets) => (
          <View>
            <View
              style={[
                styles.container,
                CS.backgroundSecondary,
                ThemedStyles.style.borderBottomHair,
                ThemedStyles.style.borderBackgroundPrimary,
                { paddingTop: insets.top },
              ]}>
              <View style={styles.topbar}>
                <View style={styles.topbarLeft}>
                  <TouchableOpacity onPress={refreshFeed}>
                    <Image
                      source={logo}
                      style={styles.bulb}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
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

export default TopbarNewsfeed;

let topbarHeight = 50;

if (Platform.OS == 'ios') {
  topbarHeight = 100;
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
  bulb: {
    width: 42,
    height: 35,
    alignSelf: 'flex-start',
  },
  topbar: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    marginLeft: Platform.select({ ios: 15, android: 10 }),
    flex: 1,
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
