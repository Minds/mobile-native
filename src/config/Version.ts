import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

export const Version = {
  VERSION: process.env.APP_VERSION || nativeApplicationVersion || '',
  BUILD: nativeBuildVersion,
};
