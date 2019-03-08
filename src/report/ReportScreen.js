import React, {
  Component
} from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Alert,
  Button,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import reportService from './ReportService';

import ModalTopbar from '../topbar/ModalTopbar';
import colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

const REASONS = [
  { value: 1 , label: 'Illegal' },
  { value: 2, label: 'Should be marked as explicit' },
  { value: 3, label: 'Encourages or incites violence' },
  { value: 4, label: 'Threatens, harasses, bullies or encourages others to do so' },
  { value: 5, label: 'Personal and confidential information' },
  { value: 6, label: 'Maliciously targets users (@name, links, images or videos)' },
  { value: 7, label: 'Impersonates someone in a misleading or deceptive manner' },
  { value: 8, label: 'Spam' },
  { value: 10, label: 'This infringes my copyright' },
  { value: 11, label: 'Another reason' }
];

export default class ReportScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Report',
    headerRight: (
      <View>
        {
          navigation.state.params.requireNote &&
          <Button
            title="Submit"
            onPress={navigation.state.params.selectReason ?
              navigation.state.params.selectReason : () => null}
          />
        }
      </View>
    ),
    transitionConfig: {
      isModal: true
    },
  });

  state = {
    note: '',
    reason: null,
  };

  componentDidMount() {
    this.setState({
      entity: this.props.navigation.state.params.entity,
    });
    this.props.navigation.setParams({ selectReason: this.selectReason.bind(this) });
  }

  async submit() {
    try {
      await reportService.report(this.state.entity.guid, this.state.reason.value, this.state.note);
      this.props.navigation.goBack();

      Alert.alert(
        'Thanks',
        "We've got your report and will check it out soon",
        [
          {text: 'Dismiss', onPress: () => null},
        ],
        { cancelable: false }
      )
    } catch (e) {
      Alert.alert(
        'Ooopppsss',
        'There was a problem submitting your report',
        [
          {text: 'Try again', onPress: () => null},
        ],
        { cancelable: true }
      )
    }
  }

  async selectReason(reason) {
    if (!reason)
      reason = this.state.reason;

    if (reason.value >= 10 && !this.state.note) {
      this.setState({
        requireNote: true,
        reason: reason,
      });
      this.props.navigation.setParams({ requireNote: true });
      return;
    }

    await this.setState({
      reason
    });

    this.submit();
  }

  render() {
    const reasonItems = REASONS.map((reason, i) => {
      return (
        <TouchableOpacity style={styles.reasonItem} key={i} onPress={ () => this.selectReason(reason) }>
          <View style={styles.reasonItemLabelContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
              <Text style={styles.reasonItemLabel}>{ reason.label }</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Icon name="chevron-right" size={36} style={styles.chevron} />
          </View>
        </TouchableOpacity>);
    });

    const noteInput = (
      <TextInput
        multiline = {true}
        numberOfLines = {4}
        style={{ backgroundColor: '#FFF', padding: 16, paddingTop: 24, borderWidth: 1, borderColor: '#ececec', minHeight: 100 }}
        placeholder="Please explain why you wish to report this content in a few brief sentences."
        returnKeyType="done"
        placeholderTextColor="gray"
        underlineColorAndroid='transparent'
        onChangeText={(value) => this.setState({ note: value })}
        autoCapitalize={'none'}
      />
    );

    return (
      <ScrollView style={CommonStyle.flexContainer}>
        <View style={{ flex: 1 }}>
          { !this.state.requireNote && reasonItems }

          { this.state.requireNote && noteInput }

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  reasonItemLabelContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonItemLabel: {
    flex: 1,
    fontWeight: '600',
    color: '#444',
    textAlign: 'left',
  },
  chevronContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
  },
  chevron: {
    color: '#ececec',
  },
});