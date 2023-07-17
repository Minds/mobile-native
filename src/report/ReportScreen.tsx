import React, { Component } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import openUrlService from '~/common/services/open-url.service';
import { Icon, IconButton, Screen, ScreenHeader } from '~/common/ui';
import { showNotification } from '../../AppMessages';
import CenteredLoading from '../common/components/CenteredLoading';
import MText from '../common/components/MText';
import TextInput from '../common/components/TextInput';
import i18n from '../common/services/i18n.service';
import mindsService from '../common/services/minds-config.service';
import ThemedStyles from '../styles/ThemedStyles';
import reportService from './ReportService';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import MenuItem from '../common/components/menus/MenuItem';

type PropsType = {
  route: any;
  navigation: any;
};

type Reason = {
  label: string;
  value: number;
  hasMore: boolean;
  reasons?: Reason[];
};

type StateType = {
  reason: Reason | null;
  reasons: Array<Reason> | null;
  subreason: Reason | null;
  note: string;
  entity?: any;
  requireNote: boolean;
};

class ReportScreen extends Component<PropsType, StateType> {
  state: StateType = {
    note: '',
    reason: null,
    subreason: null,
    reasons: null,
    requireNote: false,
  };

  /**
   * Component did mount
   */
  componentDidMount() {
    const navigation = this.props.navigation;
    const { goBack, entity } = this.props.route.params ?? {};
    navigation.setOptions({
      title: i18n.t('report'),
      headerLeft: () => {
        return (
          <IconButton
            name="chevron-left"
            size={38}
            style={ThemedStyles.style.colorLink}
            onPress={() => (goBack ? goBack() : navigation.goBack())}
          />
        );
      },
      transitionConfig: {
        isModal: true,
      },
    });

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ entity });
    this.loadReasons();
    this.props.navigation.setParams({
      confirmAndSubmit: this.confirmAndSubmit.bind(this),
    });
  }

  /**
   * Load reasons from minds settings
   */
  loadReasons() {
    const settings = mindsService.getSettings();

    // reasons in current language with fallback in english translation, in case that both fails the origial label is shown
    settings.report_reasons.forEach(r => {
      //@ts-ignore we ignore the type validation because it depends on the server response
      r.label = i18n.t(`reports.reasons.${r.value}.label`, {
        defaultValue: r.label,
      });
      if (r.reasons && r.reasons.length) {
        r.reasons.forEach(r2 => {
          r2.label = i18n.t(
            //@ts-ignore
            `reports.reasons.${r.value}.reasons.${r2.value}.label`,
            { defaultValue: r2.label },
          );
        });
      }
    });

    this.setState({ reasons: settings.report_reasons });
  }

  /**
   * Submit the report
   */
  async submit() {
    if (!this.state.reason) {
      return;
    }

    try {
      const subreason = this.state.subreason
        ? this.state.subreason.value
        : null;
      await reportService.report(
        this.state.entity.guid,
        this.state.reason.value,
        subreason,
        this.state.note,
      );
      this.props.navigation.goBack();

      Alert.alert(
        i18n.t('thanks'),
        i18n.t('reports.weHaveGotYourReport'),
        [{ text: i18n.t('ok'), onPress: () => null }],
        { cancelable: false },
      );
    } catch (e) {
      Alert.alert(
        i18n.t('error'),
        i18n.t('reports.errorSubmitting'),
        [
          { text: i18n.t('tryAgain'), onPress: () => this.submit() },
          { text: 'Cancel' },
        ],
        { cancelable: true },
      );
    }
  }

  /**
   * Clear reason
   */
  clearReason = () => {
    this.setState({
      reason: null,
      requireNote: false,
      subreason: null,
      note: '',
    });
    this.props.navigation.setParams({
      goBack: null,
      requireNote: false,
    });

    this.props.navigation.setOptions({ headerRight: null });
  };

  /**
   * Select subreason
   * @param {object} subreason
   */
  async selectSubreason(subreason) {
    await this.setState({ subreason });

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

    if (reason.value === 11 && !this.state.note) {
      this.setState({
        requireNote: true,
        reason: reason,
      });

      this.props.navigation.setParams({
        goBack: this.clearReason,
      });
      this.props.navigation.setOptions({
        headerRight: () => (
          <View>
            <Button
              title={i18n.t('settings.submit')}
              onPress={this.props.route.params?.confirmAndSubmit}
            />
          </View>
        ),
      });
      return;
    }

    if (reason.hasMore) {
      this.props.navigation.setParams({ goBack: this.clearReason });
      return this.setState({ reason });
    }

    await this.setState({
      reason,
    });

    this.confirmAndSubmit();
  }

  /**
   * Confirm and submit
   */
  confirmAndSubmit() {
    if (this.state.requireNote && this.state.note === '') {
      showNotification(i18n.t('reports.explain'));
      return;
    }

    Alert.alert(
      i18n.t('confirm'),
      `${i18n.t('reports.reportAs')}\n${this.state.reason?.label}\n` +
        (this.state.subreason ? this.state.subreason.label : ''),
      [
        {
          text: i18n.t('no'),
          onPress: () =>
            this.state.subreason
              ? this.setState({ subreason: null })
              : this.clearReason(),
        },
        { text: i18n.t('yes'), onPress: () => this.submit() },
      ],
      { cancelable: false },
    );
  }

  getExternalLinkForReason(reason): undefined | string {
    if (reason.value === 10) {
      return 'https://support.minds.com/hc/en-us/requests/new?ticket_form_id=360003221852';
    }

    return;
  }

  /**
   * Render reasons list
   */
  renderReasons() {
    const theme = ThemedStyles.style;

    const reasons =
      this.state.reason && this.state.reason.hasMore
        ? this.state.reason.reasons
        : this.state.reasons;

    const reasonItems = reasons?.map((reason, i) => {
      const externalLink = this.getExternalLinkForReason(reason);
      return (
        <MenuItem
          key={i}
          onPress={
            externalLink
              ? () => openUrlService.open(externalLink)
              : () =>
                  this.state.reason
                    ? this.selectSubreason(reason)
                    : this.selectReason(reason)
          }
          title={reason.label}
          borderless
          noIcon={!reason.hasMore}
          icon={
            externalLink && (
              <Icon name={'external-link'} size="large" color="Link" />
            )
          }
        />
      );
    });

    return reasonItems;
  }

  /**
   * Update not value
   */
  updateNote = value => this.setState({ note: value });

  /**
   * Render
   */
  render() {
    if (!this.state.reasons) {
      return <CenteredLoading />;
    }

    const theme = ThemedStyles.style;
    const showTitle = this.state.reason && this.state.reason.hasMore;
    return (
      <Screen safe scroll>
        <ScreenHeader
          backIcon={this.state.reason?.hasMore ? undefined : 'close'}
          back
          onBack={
            this.state.reason?.hasMore
              ? () => this.setState({ reason: null })
              : undefined
          }
          title={i18n.t('report')}
        />
        {showTitle && (
          <MText
            style={[
              theme.fontXL,
              theme.bold,
              theme.colorPrimaryText,
              theme.paddingHorizontal4x,
              theme.paddingVertical4x,
            ]}>
            {this.state.reason?.label}
          </MText>
        )}
        <View style={theme.flexContainer}>
          {!this.state.requireNote && this.renderReasons()}

          {this.state.requireNote && (
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={[
                theme.padding3x,
                theme.margin2x,
                theme.fontL,
                theme.colorPrimaryText,
              ]}
              placeholder={i18n.t('reports.explain')}
              returnKeyType="done"
              autoFocus={true}
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              onChangeText={this.updateNote}
              autoCapitalize={'none'}
            />
          )}
        </View>
      </Screen>
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
    minHeight: 50,
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

export default withErrorBoundaryScreen(ReportScreen, 'ReportScreen');
