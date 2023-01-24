import * as Sentry from '@sentry/react-native';
import { isFeatureOn } from 'ExperimentsProvider';
import codePush from 'react-native-code-push';
import CodePushDebugger from './widgets/CodePushDebugger';
import CodePushUpdatePrompt from './widgets/CodePushUpdatePrompt';

export { CodePushDebugger, CodePushUpdatePrompt, codePush };

export const logMessage = (event: any, prefix = 'CodePush log:') => {
  isFeatureOn('mob-4722-track-code-push')
    ? Sentry.captureMessage(`${prefix} ${JSON.stringify(event)}`)
    : undefined;
};

export const logError = (event: any) => logMessage(event, 'CodePush error:');
