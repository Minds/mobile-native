import { Platform } from 'react-native';
import Reactotron from 'reactotron-react-native';

Reactotron.configure({
  name: 'Minds',
  host: Platform.OS === 'android' ? '192.168.1.120' : 'localhost',
  port: 9090,
})
  .useReactNative({
    asyncStorage: true,
    editor: true,
    storybook: true,
    networking: {
      // ignoreContentTypes: /^(image)\/.*$/i,
      ignoreUrls: /http?:\/\/[127.0.0.1|192.168.1.{d}2]/,
    },
  })
  .connect();

if (__DEV__) {
  const oldConsoleLog = console.log;
  const oldConsoleWarn = console.warn;
  console.log = (...args: (string | undefined)[]) => {
    oldConsoleLog(...args);
    Reactotron.display(tronOptions(args));
  };

  console.warn = (...args: (string | undefined)[]) => {
    oldConsoleWarn(...args);
    Reactotron.display({
      ...tronOptions(args),
      name: 'WARN',
      important: true,
    });
  };
}

const tronOptions = (args: (string | undefined)[]) => ({
  name: 'LOG',
  value: args,
  preview: (args.length > 0 && typeof args[0] === 'string'
    ? args[0]
    : JSON.stringify(args?.[0])
  ).slice(0, 96),
});

export { Reactotron };
