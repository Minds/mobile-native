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
  ActivityIndicator,
  Alert
} from 'react-native';

import { CheckBox } from 'react-native-elements'

import {
  observer,
  inject
} from 'mobx-react/native'

import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';

import CenteredLoading from '../common/components/CenteredLoading';
import RewardsCarousel from '../channel/carousel/RewardsCarousel';

import FeaturesService from '../common/services/features.service';
import number from '../common/helpers/number';
import token from '../common/helpers/token';
import addressExcerpt from '../common/helpers/address-excerpt';

/**
 * Wire Fab Screen
 */
@inject('wire')
@inject('wallet')
@observer
export default class FabScreen extends Component {

  componentWillMount() {

    if (!FeaturesService.has('crypto')) {
      Alert.alert(
        'Oooopppss',
        'This feature is currently unavailable on your platform',
      );
      return this.props.navigation.goBack();
    }

    const owner = this.getOwner();
    this.props.wire.setGuid(owner.guid);

    this.props.wire.loadUser(owner.guid)
      .then(() => this.setDefaults());

    this.props.wallet.refresh();
    }

  componentWillUnmount() {
    this.props.wire.setOwner(null);
  }

  setDefaults() {
    const params = this.props.navigation.state.params;
    const wire = this.props.wire;
    const owner = wire.owner;

    if (params.default) {
      wire.setAmount(params.default.min);

      if (!params.disableThresholdCheck && owner.sums && owner.sums[params.default.type]) {
        wire.setAmount(wire.amount - Math.ceil(owner.sums[params.default.type]));
      }
    }

    if (wire.amount < 0) {
      wire.setAmount(0);
    }
  }

  getOwner() {
    return this.props.navigation.state.params.owner;
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={styles.header}>
        <Icon size={36} name="ios-close" onPress={() => navigation.goBack()} style={styles.iconclose}/>
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
    if (this.props.wire.owner.wire_rewards && this.props.wire.owner.wire_rewards.length) {
      carousel = <RewardsCarousel rewards={this.props.wire.owner.wire_rewards.rewards.tokens} textAlign={'center'} backgroundColor="#F8F8F8" hideIcon={true} />
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

        <Text style={styles.subtext}>
          Support <Text style={styles.bold}>@{ owner.username }</Text> by sending them tokens.
          Once you send them the amount listed in the tiers, you can receive rewards if they are offered. Otherwise,
          it's a donation.
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 32, marginBottom: 32, }}>
          <TextInput 
            ref="input"
            onChangeText={this.changeInput}
            style={[CommonStyle.field, styles.input]}
            underlineColorAndroid="transparent"
            value={this.props.wire.amount.toString()}
            keyboardType="numeric"
            />

          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '600', fontFamily: 'Roboto', padding: 16, color: '#555' }}>
              Tokens
            </Text>
          </View>
        </View>

        <View style={{ width: '100%', alignSelf: 'flex-start', }}>
          <CheckBox
            title="Repeat this transaction every month"
            checked={this.props.wire.recurring}
            onPress={() => this.props.wire.toggleRecurring()}
            left
            checkedIcon="check-circle-o"
            checkedColor={ colors.primary }
            uncheckedIcon="circle-o"
            uncheckedColor={ colors.greyed }
            containerStyle={{ margin: 0 }}
          />
        </View>

        { this.props.wire.owner.wire_rewards && this.props.wire.owner.wire_rewards.length && <View>
          <Text style={styles.rewards}>{ owner.username }'s rewards</Text>
          <Text style={styles.lastmonth}>You have sent <Text style={styles.bold}>{txtAmount}</Text> in the last month.</Text>
          </View> }

        {carousel}

        <Button
          title={(this.props.wire.amount == 0) ? 'Ok' : 'Send'}
          buttonStyle={styles.send}
          disabled={this.props.wire.sending}
          onPress={this.confirmSend}
          backgroundColor={selectedcolor}
        />

        {!!this.props.wallet.addresses && <View style={styles.addressViewWrapper}>
          {this.props.wallet.addresses.map((address, i) => (
            <View style={styles.addressView} key={address.address}>
              <View style={styles.addressMetaView}>
                <Text style={styles.addressLabel}>{address.label} Address</Text>
                <Text style={styles.addressAddress} ellipsizeMode='tail' numberOfLines={1}>{addressExcerpt(address.address)}</Text>
              </View>

              <View style={styles.addressBalanceView}>
                <Text style={styles.addressBalanceText}>{number(token(address.balance, 18), 3)}</Text>
              </View>
            </View>
          ))}
        </View>}
      </ScrollView>
    );
  }

  validate() {
    try {
      this.props.wire.validate();
      return true;
    } catch(e) {
      Alert.alert(
        'Atention',
        (e && e.message) || 'Unknown internal error',
        [{ text: 'OK' }],
        { cancelable: false }
      )
      return false;
    }
  }

  confirmSend = () => {
    // is 0 just we execute complete
    if (this.props.wire.amount == 0) {
      const onComplete = this.props.navigation.state.params.onComplete;
      if (onComplete) onComplete();
      this.props.navigation.goBack();
      return;
    }

    if (!this.validate()) return;

    Alert.alert(
      'Are you sure?',
      'You will send ' + this.props.wire.formatAmount(this.props.wire.amount) + ' to @' + this.props.wire.owner.username,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.send() },
      ],
      { cancelable: false }
    );
  }

  /**
   * Call send and go back on success
   */
  async send() {
    const onComplete = this.props.navigation.state.params.onComplete;
    try {
      let done = await this.props.wire.send();

      if (!done) {
        return;
      }

      if (onComplete) onComplete();
      this.props.navigation.goBack();
    } catch (e) {
      if (!e || e.message !== 'E_CANCELLED') {
        console.error('Wire/send()', e);

        Alert.alert(
          'There was a problem sending wire',
          (e && e.message) || 'Unknown internal error',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
    }
  }

  /**
   * Get formated amount of last month sum
   */
  getTextAmount() {
    return this.props.wire.formatAmount(this.props.wire.owner.sums.tokens);
  }

  changeInput = (val) => {
    this.props.wire.setAmount(val);
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
    paddingRight: 16,
    backgroundColor: '#eee',
    borderRadius: 3,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold'
  },
  subtext: {
    fontWeight: '200',
    textAlign: 'left',
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
    paddingLeft: 16,
    paddingRight: 16,
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
  },

  addressViewWrapper: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: colors.greyed,
    borderRadius: 4,
    width: '100%',
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 10
  },
  addressMetaView: {
    flexGrow: 1,
  },
  addressLabel: {
    fontWeight: '700',
  },
  addressAddress: {
    color: colors.darkGreyed,
    fontSize: 10
  },
  addressBalanceView: {
    paddingLeft: 10,
  },
  addressBalanceText: {
    color: 'green',
    fontSize: 18,
    fontWeight: '700'
  }
}
