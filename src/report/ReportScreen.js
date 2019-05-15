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
import i18n from '../common/services/i18n.service';

const REASONS = [
  { value: 1  },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 10 },
  { value: 11 },
];

export default class ReportScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: i81n.t('report'),
    headerRight: (
      <View>
        {
          navigation.state.params.requireNote &&
          <Button
            title={i18n.t('settings.submit')}
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

  constructor(props) {
    super(props);

    REASONS.forEach(r => {
      r.label = i18n.t('reports.reasons.'+r.value);
    });
  }

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
        i18n.t('thanks'),
        i18n.t('reports.weHaveGotYourReport'),
        [
          {text: i18n.t('ok'), onPress: () => null},
        ],
        { cancelable: false }
      )
    } catch (e) {
      Alert.alert(
        i18n.t('error'),
        i18n.t('reports.errorSubmitting'),
        [
          {text: i18n.t('tryAgain'), onPress: () => null},
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
        placeholder={i18n.t('reports.explain')}
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