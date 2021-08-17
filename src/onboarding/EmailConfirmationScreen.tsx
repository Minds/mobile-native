//@ts-nocheck
import React, { Component } from 'react';

import { View, Text } from 'react-native';
import CenteredLoading from '../common/components/CenteredLoading';
import i18n from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';
import ThemedStyles from '../styles/ThemedStyles';

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

    console.log('confirming');

    const result = await sessionService
      .getUser()
      .confirmEmail(this.props.route.params);

    console.log('confirmEmail called', result);

    if (!result) {
      console.log('confirm !result');

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
          style={[
            ThemedStyles.style.fontL,
            ThemedStyles.style.textCenter,
            ThemedStyles.style.colorDarkGreyed,
          ]}
          onPress={this.confirm}>
          {i18n.t('errorMessage') + '\n'}
          <Text style={[ThemedStyles.style.colorPrimary]}>
            {i18n.t('tryAgain')}
          </Text>
        </Text>
      );
    }

    if (this.state.confirmed) {
      console.log('email confirmed');
      return (
        <Text
          style={[ThemedStyles.style.fontXL, ThemedStyles.style.textCenter]}
          onPress={() => this.props.navigation.goBack()}>
          {i18n.t('emailConfirm.confirmed') + '\n'}
          <Text>{i18n.t('goback')}</Text>
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
      <View
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.centered]}>
        {this.renderBody()}
      </View>
    );
  }
}
