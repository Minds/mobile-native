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
  Linking,
} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import reportService from './ReportService';

import ModalTopbar from '../topbar/ModalTopbar';
import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import mindsService from '../common/services/minds.service';
import CenteredLoading from '../common/components/CenteredLoading';

export default class ReportScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Report',
    headerLeft: () => {
      return <Icon name="chevron-left" size={38} color={colors.primary} onPress={
        () => {
          if (navigation.state.params && navigation.state.params.goBack) return navigation.state.params.goBack();
          navigation.goBack();
        }
      }/>
    },
    headerRight: (
      <View>
        {
          navigation.state.params.requireNote &&
          <Button
            title="Submit"
            onPress={navigation.state.params.confirmAndSubmit ?
              navigation.state.params.confirmAndSubmit : () => null}
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
    subreason: null,
    reasons: null,
  };

  /**
   * Component did mount
   */
  componentDidMount() {
    this.setState({
      entity: this.props.navigation.state.params.entity,
    });
    this.loadReasons();
    this.props.navigation.setParams({ confirmAndSubmit: this.confirmAndSubmit.bind(this) });
  }

  /**
   * Load reasons from minds settings
   */
  async loadReasons() {
    const settings = await mindsService.getSettings();
    this.setState({reasons: settings.report_reasons});
  }

  /**
   * Submit the report
   */
  async submit() {
    try {
      const subreason = this.state.subreason ? this.state.subreason.value : null;
      await reportService.report(this.state.entity.guid, this.state.reason.value, subreason, this.state.note);
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
          {text: 'Try again', onPress: () => this.submit()},
          {text: 'Cancel'},
        ],
        { cancelable: true }
      )
    }
  }

  /**
   * Clear reason
   */
  clearReason = () => {
    this.setState({reason: null, requireNote: false, subreason: null});
    this.props.navigation.setParams({ goBack: null, requireNote: false});
  }

  /**
   * Select subreason
   * @param {object} subreason
   */
  async selectSubreason(subreason) {
    await this.setState({subreason});

    this.confirmAndSubmit();
  }

  /**
   * Select reason
   * @param {object} reason
   */
  async selectReason(reason) {

    if (!reason) {
      reason = this.state.reason;
    }

    if (reason.value == 11 && !this.state.note) {
      this.setState({
        requireNote: true,
        reason: reason,
      });
      this.props.navigation.setParams({ requireNote: true, goBack: this.clearReason });
      return;
    }

    if (reason.hasMore) {
      this.props.navigation.setParams({ goBack: this.clearReason});
      return this.setState({reason});
    }

    await this.setState({
      reason
    });

    this.confirmAndSubmit();
  }

  /**
   * Confirm and submit
   */
  confirmAndSubmit() {
    Alert.alert(
      'Confirm',
      `Do you want to report this post as:\n${this.state.reason.label}\n` + (this.state.subreason ? this.state.subreason.label : ''),
      [
        {text: 'No'},
        {text: 'Yes', onPress: () => this.submit()},
      ],
      { cancelable: false }
    );
  }

  /**
   * Open default mailer
   */
  mailToCopyright = () => {
    Linking.openURL('mailto:copyright@minds.com');
  }

  /**
   * Render reasons list
   */
  renderReasons() {

    if (this.state.reason && this.state.reason.value == 10) {
      return <Text style={[CS.fontL, CS.padding2x, CS.textCenter]} onPress={this.mailToCopyright}>Please submit a DMCA notice to copyright@minds.com.</Text>
    }

    const reasons = (this.state.reason && this.state.reason.hasMore) ? this.state.reason.reasons : this.state.reasons;

    const reasonItems = reasons.map((reason, i) => {
      return (
        <TouchableOpacity style={styles.reasonItem} key={i} onPress={ () => this.state.reason ? this.selectSubreason(reason) : this.selectReason(reason) }>
          <View style={styles.reasonItemLabelContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
              <Text style={styles.reasonItemLabel}>{ reason.label }</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Icon name="chevron-right" size={36} color={reason.hasMore ? colors.primary : colors.greyed} />
          </View>
        </TouchableOpacity>);
    });

    return reasonItems;
  }

  /**
   * Update not value
   */
  updateNote = (value) => this.setState({ note: value });

  /**
   * Render
   */
  render() {
    if (!this.state.reasons) return <CenteredLoading/>

    const noteInput = (
      <TextInput
        multiline = {true}
        numberOfLines = {4}
        style={[CS.padding2x, CS.margin, CS.borderBottom, CS.borderGreyed]}
        placeholder="Please explain why you wish to report this content in a few brief sentences."
        returnKeyType="done"
        autoFocus={true}
        placeholderTextColor="gray"
        underlineColorAndroid='transparent'
        onChangeText={this.updateNote}
        autoCapitalize={'none'}
      />
    );

    return (
      <ScrollView style={CS.flexContainer}>
        {this.state.reason && <Text style={[CS.fontM, CS.backgroundPrimary, CS.colorWhite, CS.padding]}>{this.state.reason.label}</Text>}
        <View style={{ flex: 1 }}>
          { !this.state.requireNote && this.renderReasons() }

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