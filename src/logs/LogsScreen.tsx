import React, {
  Component
} from 'react';

import { LogView } from 'react-native-device-log';

/**
 * App logs screen
 */
export default class LogsScreen extends Component {

  /**
   * Render
   */
  render() {
    return (
      <LogView inverted={false} multiExpanded={true} timeStampFormat='HH:mm:ss'></LogView>
    );
  }
}
