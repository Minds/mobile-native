import {
  Alert,
} from 'react-native';


export class UserError extends Error {
  constructor(...args) {
      super(...args)
      Alert.alert(
        '',
        `
        ${args[0]}
      `,
        [{
          text: 'Ok',
        }]
      );
  }
}

export const isUserError = function(err) {
  return err instanceof UserError;
}

