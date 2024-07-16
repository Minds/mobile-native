import React, {
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
  useImperativeHandle,
  useState,
} from 'react';
import { View } from 'react-native';
import FriendlyCaptcha from './FriendlyCaptcha';
import sp from '~/services/serviceProvider';

export let friendlyCaptchaReference: null | FriendlyCaptchaProviderHandle =
  null;

export function setFriendlyCaptchaReference(ref) {
  friendlyCaptchaReference = ref;
}

interface Captcha {
  id: number;
  origin: string;
  onSolved: (solution: string) => void;
}

interface FriendlyCaptchaProviderHandle {
  /**
   * given a puzzle origin, it solves a puzzle and returns a
   * promise that resolves with the puzzle solution
   */
  solveAPuzzle: (origin: string) => Promise<string>;
}

const FriendlyCaptchaProvider: ForwardRefRenderFunction<
  FriendlyCaptchaProviderHandle,
  PropsWithChildren<{ children: React.ReactNode }>
> = ({ children }, ref) => {
  const [captchas, setCaptchas] = useState<Captcha[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      solveAPuzzle: (puzzleOrigin: string) =>
        new Promise((resolve, _reject) => {
          // TODO: handle rejection
          const id = Math.random();

          setCaptchas(oldCaptchas => [
            ...oldCaptchas,
            {
              id,
              origin: puzzleOrigin,
              onSolved: (solution: string) => {
                resolve(solution);
                setCaptchas(oldCaptchas2 =>
                  oldCaptchas2.filter(c => c.id !== id),
                );
              },
            },
          ]);
        }),
    }),
    [],
  );

  return (
    <>
      {children}
      <View style={styles.container}>
        {captchas.map(captcha => (
          // TODO: handle multiple captchas and captcha origin
          <FriendlyCaptcha
            key={captcha.id}
            origin={captcha.origin}
            onSolved={captcha.onSolved}
          />
        ))}
      </View>
    </>
  );
};

const styles = sp.styles.create({
  container: {
    height: 0,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
  },
});

export default forwardRef(FriendlyCaptchaProvider);
