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
  ScrollView,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';

import reportService from './ReportService';

import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';
import i18n from '../common/services/i18n.service';

import mindsService from '../common/services/minds.service';
import CenteredLoading from '../common/components/CenteredLoading';

export default class ReportScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: i18n.t('report'),
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
            title={i18n.t('settings.submit')}
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

    // reasons in current language with fallback in english translation, in case that both fails the origial label is shown
    settings.report_reasons.forEach(r => {
      r.label = i18n.t(`reports.reasons.${r.value}.label`, {defaultValue: r.label});
      if (r.reasons && r.reasons.length) {
        r.reasons.forEach(r2 => {
          r2.label = i18n.t(`reports.reasons.${r.value}.reasons.${r2.value}.label`, {defaultValue: r2.label});
        });
      }
    });

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
          {text: i18n.t('tryAgain'), onPress: () => this.submit()},
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
      i18n.t('confirm'),
      `${i18n.t('reports.reportAs')}\n${this.state.reason.label}\n` + (this.state.subreason ? this.state.subreason.label : ''),
      [
        {text: i18n.t('no')},
        {text: i18n.t('yes'), onPress: () => this.submit()},
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
      return <Text style={[CS.fontL, CS.padding2x, CS.textCenter]} onPress={this.mailToCopyright}>{i18n.t('reports.DMCA')}</Text>
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
        placeholder={i18n.t('reports.explain')}
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