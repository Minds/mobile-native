import React, { Component } from 'react';

import { View } from 'react-native';
import { Button } from '~/common/ui';
import CenteredLoading from '../common/components/CenteredLoading';
import MText from '../common/components/MText';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

/**
 * Email confirmation screen
 */
class EmailConfirmationScreen extends Component<{
  navigation: any;
  route: any;
}> {
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
  // componentDidMount() {
  //   this.confirm();
  // }

  /**
   * Confirm
   */
  // confirm = async () => {
  //   this.setState({ error: false });

  //   const result = await sessionService
  //     .getUser()
  //     .confirmEmail(this.props.route.params);

  //   if (!result) {
  //     this.setState({ error: true });
  //   } else {
  //     this.setState({ confirmed: true });
  //   }
  // };

  /**
   * Render body
   */
  renderBody() {
    if (this.state.error) {
      return (
        <MText
          style={[ThemedStyles.style.fontL, ThemedStyles.style.textCenter]}>
          {i18n.t('errorMessage') + '\n'}
          <MText style={ThemedStyles.style.colorLink}>
            {i18n.t('tryAgain')}
          </MText>
        </MText>
      );
    }

    if (this.state.confirmed) {
      return (
        <View>
          <MText
            style={[ThemedStyles.style.fontXXL, ThemedStyles.style.textCenter]}
            onPress={() => this.props.navigation.goBack()}>
            {i18n.t('emailConfirm.confirmed') + '\n'}
          </MText>
          <Button onPress={() => this.props.navigation.goBack()}>
            {i18n.t('goback')}
          </Button>
        </View>
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

export default withErrorBoundaryScreen(
  EmailConfirmationScreen,
  'EmailConfirmationScreen',
);
