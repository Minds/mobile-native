
import React, {
  Component
} from 'react';

import {
  Text,
  StyleSheet,
  View
} from 'react-native';
import { CommonStyle as CS } from '../../styles/Common';

/**
 * Error boundary
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    //TODO: send info of the error somewhere?
  }

  getErrorMessage() {
    return (
      <View style={[CS.hairLineBottom]}>
        <Text style={[CS.fontM, CS.textCenter, CS.marginTop2x, CS.marginBottom2x, CS.fontHairline]}>{this.props.message}</Text>
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.getErrorMessage();
    }

    return this.props.children;
  }
}