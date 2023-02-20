import * as Sentry from '@sentry/react-native';
import { hasVariation } from 'ExperimentsProvider';
import codePush from 'react-native-code-push';
import CodePushDebugger from './widgets/CodePushDebugger';
import CodePushUpdatePrompt from './widgets/CodePushUpdatePrompt';
import CodePushSyncScreen from './CodePushSyncScreen';

export { CodePushDebugger, CodePushUpdatePrompt, codePush, CodePushSyncScreen };

export const logMessage = (event: any, prefix = 'CodePush log:') => {
  hasVariation('mob-4722-track-code-push')
    ? Sentry.captureMessage(`${prefix} ${JSON.stringify(event)}`)
    : undefined;
};

export const logError = (event: any) => logMessage(event, 'CodePush error:');
