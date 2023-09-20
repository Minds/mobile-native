export { default as codePush } from 'react-native-code-push';
export { default as CodePushDebugger } from './widgets/CodePushDebugger';
export { default as CodePushSyncScreen } from './CodePushSyncScreen';
export { default as CodePushCustomIcon } from './widgets/CodePushCustomIcon';
export { default as codePushStore } from './codepush.store';

export const logMessage = (event: any, prefix = 'CodePush log:') => {
  console.log(prefix, event);
};

export const logError = (event: any) => logMessage(event, 'CodePush error:');
