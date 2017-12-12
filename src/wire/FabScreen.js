import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import CenteredLoading from '../common/components/CenteredLoading';
import RewardsCarousel from '../channel/carousel/RewardsCarousel';

import { Button } from 'react-native-elements';

/**
 * Wire Fab Screen
 */
@inject('wire')
@observer
export default class FabScreen extends Component {

  componentWillMount() {
    this.props.wire.setMethod('money');
    this.props.wire.setAmount(1);

    const owner = this.getOwner();
    this.props.wire.setGuid(owner.guid);
    this.props.wire.loadUser(owner.guid);
  }

  componentWillUnmount() {
    this.props.wire.setOwner(null);
  }

  getOwner() {
    return this.props.navigation.state.params.owner;
  }

  setMethod(opt) {
    this.props.wire.setMethod(opt);
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={styles.header}>
        <Icon size={28} name="ios-close" onPress={() => navigation.goBack()} style={styles.iconclose}/>
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  })

  /**
   * Render screen
   */
  render() {
    if (!this.props.wire.owner) {
      return <CenteredLoading/>
    }

    // get the owner passed as a parameter in navigation
    const owner = this.getOwner();
    const txtAmount = this.getTextAmount();

    let carousel = null;

    // show carousel?
    if (this.props.wire.method == 'money' && this.props.wire.owner.wire_rewards) {
      carousel = <RewardsCarousel rewards={this.props.wire.owner.wire_rewards.rewards} textAlign={'center'} backgroundColor="#F8F8F8" />
    }

    // sending?
    let icon;
    if (this.props.wire.sending) {
      icon = <ActivityIndicator size={'large'} color={selectedcolor}/>
    } else {
      icon = <Icon size={64} name="ios-flash" style={styles.icon} />
    }

    return (
      <ScrollView contentContainerStyle={styles.body}>
        {icon}
        <Text style={styles.subtext}>Support <Text style={styles.bold}>@{ owner.username }</Text> by sending them dollars, points or Bitcoin. Once you send them the amount listed in the tiers, you can receive rewards if they are offered. Otherwise, it's a donation.</Text>
        <TextInput ref="input" onChangeText={this.changeInput} style={styles.input} underlineColorAndroid="transparent" value={this.props.wire.amount.toString()} keyboardType="numeric" />
        {this.renderOptions()}
        <Text style={styles.rewards}>{ owner.username }'s rewards</Text>
        <Text style={styles.lastmonth}>You have sent <Text style={styles.bold}>{txtAmount}</Text> in the last month.</Text>

        {carousel}

        <Button
          title="Send"
          buttonStyle={styles.send}
          disabled={this.props.wire.sending}
          onPress={this.send}
          backgroundColor={selectedcolor}
        />
      </ScrollView>
    );
  }

  /**
   * Call send and go back on success
   */
  send = () => {
    this.props.wire.send(() => this.props.navigation.goBack());
  }

  /**
   * Get formated amount of last month sum
   */
  getTextAmount() {
    const wire = this.props.wire;
    switch (wire.method) {
      case 'points':
        return wire.formatAmount(wire.owner.sums.points);
      case 'money':
        return wire.formatAmount(wire.owner.sums.money);
      case 'mindscoin':
        return '';
    }
  }

  changeInput = (val) => {
    this.props.wire.setAmount(val);
  }

  renderOptions() {
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.button} onPress={() => this.setMethod('points')}>
            <McIcon name="bank" size={23} color={this.props.wire.method == 'points' ? selectedcolor : color} />
            <Text style={[styles.buttontext, { color: this.props.wire.method == 'points' ? selectedcolor : color}]}>Points</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.setMethod('money')} >
            <Icon name="logo-usd" size={24} color={this.props.wire.method == 'money' ? selectedcolor : color} />
            <Text style={[styles.buttontext, { color: this.props.wire.method == 'money' ? selectedcolor : color}]}>Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.setMethod('mindscoin')} >
            <Icon name="logo-bitcoin" size={24} color={this.props.wire.method == 'mindscoin' ? selectedcolor : color} />
            <Text style={[styles.buttontext, (this.props.wire.method == 'mindscoin' ? styles.selected:null)]}>MindsCoin</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const selectedcolor = '#4690D6';
const color = '#444'

const styles = {
  body: {
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    opacity: 0.97,
    flex:1
  },
  send: {
    marginTop: 20
  },
  input: {
    fontSize: 50,
    color: '#666',
    width:'100%',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold'
  },
  subtext: {
    fontWeight: '200',
    textAlign: 'center',
    fontSize: 12,
    color: '#666666',
    marginTop: 12,
  },
  icon: {
    color: '#4690D6'
  },
  header: {
    backgroundColor: '#F8F8F8',
  },
  iconclose: {
    alignSelf: 'flex-end',
    padding: 10
  },
  rewards: {
    fontSize: 18,
    fontWeight: '300',
    marginTop: 32
  },
  lastmonth: {
    color: '#666',
    fontSize: 13,
    fontWeight: '200',
    marginTop: 5,
    marginBottom: 10
  },
  // options styles
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttontext: {
    paddingTop: 5,
    fontSize: 16
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
  },
  selected: {
    color: selectedcolor
  },
  carousel: {
    paddingTop: 20
  }
}