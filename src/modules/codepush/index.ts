import * as Sentry from '@sentry/react-native';
import { hasVariation } from 'ExperimentsProvider';
export { default as codePush } from 'react-native-code-push';
export { default as CodePushDebugger } from './widgets/CodePushDebugger';
export { default as CodePushSyncScreen } from './CodePushSyncScreen';
export { default as codePushStore } from './codepush.store';
export { default as CodePushUpdatePrompt } from './widgets/CodePushUpdatePrompt';

export const logMessage = (event: any, prefix = 'CodePush log:') => {
  hasVariation('mob-4722-track-code-push')
    ? Sentry.captureMessage(`${prefix} ${JSON.stringify(event)}`)
    : undefined;
};

export const logError = (event: any) => logMessage(event, 'CodePush error:');
