import type UserModel from '../channel/UserModel';

export type RootStackParamList = {
  Fab: {
    disableThresholdCheck?: boolean;
    owner: UserModel;
    onComplete?: Function;
    default: {
      min: number;
      type: string;
    };
  };
  Newsfeed: {};
  Capture: {};
};

export type AuthStackParamList = {
  Login: {};
  Forgot: {
    code?: string;
  };
  Register: {};
}
