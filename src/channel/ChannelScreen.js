import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  Button
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_URI } from '../config/Config';

import abbrev from '../common/helpers/abbrev';
import Carousel from '../common/components/Carousel';

@inject('channel')
@observer
export default class ChannelScreen extends Component {

  // no NavBar
  static navigationOptions = {
    header: null
  }
  // loading
  componentWillMount() {
    const guid = this.props.navigation.state.params.guid;
    this.props.channel.load(guid);
    this.props.channel.loadrewards(guid);
  }

  getBannerFromChannel() {
    const channel = this.props.channel.channel;
    if (channel && channel.carousels) {
      return channel.carousels[0].src;
    }

    return `${MINDS_URI}fs/v1/banners/${channel.guid}/0/${channel.banner}`;
  }

  getAvatar() {
    const channel = this.props.channel.channel;
    return `${MINDS_URI}icon/${channel.guid}/large/${channel.icontime}`;
  }

  render() {
    const channel = this.props.channel.channel;
    const rewards = this.props.channel.rewards;

    if (!channel.guid) {
      return (
      <ActivityIndicator size={'large'} />
      );
    }

    const name = this.props.navigation.state.params.guid;
    const avatar = {uri:this.getAvatar()};
    const iurl = {uri:this.getBannerFromChannel()};

    const rewardsArray = [];

    if (rewards.money) {
      rewards.money.map((rew) => {
        rewardsArray.push(
          <View key={`rewards${rew.amount}`} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.rewardamount}>${rew.amount}+</Text>
              <Text style={styles.rewarddesc}>{rew.description}</Text>
            </View>
            <Icon style={styles.rewardicon} name={'ios-flash'} size={36}/>
          </View>
        );
      });
    }

    return (
      <ScrollView style={styles.container}>
        <Image source={iurl} style={styles.banner} />
        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>SUBSCRIBERS</Text>
              <Text>{abbrev(channel.subscribers_count, 0)}</Text>
            </View>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>VIEWS</Text>
              <Text>{abbrev(channel.impressions, 0)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', flex:1}}>
              <Text style={styles.name}>{channel.name.toUpperCase()}</Text>
              <Text style={styles.username}>@{channel.username}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 100}}>
              <Button
                style={{width:80, padding: 5}}
                onPress={() => {console.log('press')}}
                title="Message"
                color="#4791d6"
                accessibilityLabel="Learn more about this purple button"
              />
              <Icon name="md-settings" size={15}/>
            </View>
          </View>
          <Text style={styles.briefdescription}>{channel.briefdescription}</Text>
          <Carousel style={styles.carousel} height={70} color={'#0071ff'}>
            {rewardsArray}
          </Carousel>
        </View>
        <Image source={avatar} style={styles.avatar} />
      </ScrollView>
    );
  }
}

// style
const styles = StyleSheet.create({
  headertextcontainer: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  rewardicon: {
    color: '#0071ff',
    width: 30
  },
  rewardamount: {
    fontWeight: 'bold'
  },
  rewarddesc: {
    color: '#999'
  },
  carousel: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 190,
  },
  briefdescription: {
    fontSize: 10,
    paddingTop: 20,
    paddingBottom: 20,
    color: '#919191'
  },
  headercontainer: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
  },
  username: {
    fontSize: 8,
    color: '#999'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  countertitle: {
    color: '#666',
    fontSize: 10
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row'
  },
  counter: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 135,
    height: 110,
    width: 110,
    borderRadius: 55
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  }
});