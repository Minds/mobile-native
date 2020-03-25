import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { CommonStyle as CS } from '../styles/Common';
import CenteredLoading from '../common/components/CenteredLoading';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';

/**
 * Email confirmation screen
 */
export default class EmailConfirmationScreen extends Component {

  static navigationOptions = {
    title: 'Email confirm',
  };

  /**
   * State
   */
  state = {
    confirmed: false,
    error: false,
  };

  /**
   * Component did mount
   */
  componentDidMount() {
    this.confirm();
  }

  /**
   * Confirm
   */
  confirm = async () => {
    this.setState({ error: false });

    const result = await sessionService
      .getUser()
      .confirmEmail(this.props.route.params);

    if (!result) {
      this.setState({ error: true });
    } else {
      this.setState({ confirmed: true });
    }
  };

  /**
   * Render body
   */
  renderBody() {
    if (this.state.error) {
      return (
        <Text
          style={[CS.fontL, CS.textCenter, CS.colorDarkGreyed]}
          onPress={this.confirm}>
          {i18n.t('errorMessage') + '\n'}
          <Text style={[CS.colorPrimary]}>{i18n.t('tryAgain')}</Text>
        </Text>
      );
    }

    if (this.state.confirmed) {
      return (
        <Text
          style={[CS.fontXL, CS.textCenter, CS.colorDarkGreyed]}
          onPress={() => this.props.navigation.goBack()}>
          {i18n.t('emailConfirm.confirmed') + '\n'}
          <Text style={[CS.colorPrimary]}>{i18n.t('goback')}</Text>
        </Text>
      );
    }
    return <CenteredLoading />;
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CS.flexContainer, CS.centered]}>{this.renderBody()}</View>
    );
  }
}
