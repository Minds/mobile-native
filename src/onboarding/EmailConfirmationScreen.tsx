//@ts-nocheck
import React, { Component } from 'react';

import { View } from 'react-native';
import CenteredLoading from '../common/components/CenteredLoading';
import MText from '../common/components/MText';
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
        <MText
          style={[
            ThemedStyles.style.fontL,
            ThemedStyles.style.textCenter,
            ThemedStyles.style.colorDarkGreyed,
          ]}
          onPress={this.confirm}
        >
          {i18n.t('errorMessage') + '\n'}
          <MText style={[ThemedStyles.style.colorPrimary]}>
            {i18n.t('tryAgain')}
          </MText>
        </MText>
      );
    }

    if (this.state.confirmed) {
      return (
        <MText
          style={[
            ThemedStyles.style.fontXL,
            ThemedStyles.style.textCenter,
            ThemedStyles.style.colorDarkGreyed,
          ]}
          onPress={() => this.props.navigation.goBack()}
        >
          {i18n.t('emailConfirm.confirmed') + '\n'}
          <MText style={[ThemedStyles.style.colorPrimary]}>
            {i18n.t('goback')}
          </MText>
        </MText>
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
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.centered]}
      >
        {this.renderBody()}
      </View>
    );
  }
}
