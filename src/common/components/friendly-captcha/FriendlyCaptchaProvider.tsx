import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import FriendlyCaptcha from './FriendlyCaptcha';

export let friendlyCaptchaReference: null | {
  // TODO: use a better type
  solveAPuzzle: (origin: string) => Promise<string>;
} = null;

export function setFriendlyCaptchaReference(ref) {
  friendlyCaptchaReference = ref;
}

interface Captcha {
  id: number;
  origin: string;
  onSolved: (solution: string) => void;
}

function FriendlyCaptchaProvider({ children }, ref) {
  const [captchas, setCaptchas] = useState<Captcha[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      solveAPuzzle: (puzzleOrigin: string) =>
        new Promise((resolve, _reject) => {
          // TODO: handle rejection
          const id = Math.random();
          setCaptchas([
            ...captchas,
            {
              id,
              origin: puzzleOrigin,
              onSolved: (solution: string) => {
                setCaptchas(captchas.filter(c => c.id !== id));
                resolve(solution);
              },
            },
          ]);
        }),
    }),
    [captchas],
  );

  return (
    <>
      {children}
      <View style={styles.container}>
        {captchas.map(captcha => (
          // TODO: handle multiple captchas and captcha origin
          <FriendlyCaptcha
            origin={captcha.origin}
            onSolved={captcha.onSolved}
          />
        ))}
      </View>
    </>
  );
}

const styles = ThemedStyles.create({
  container: {
    height: 0,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
  },
});

export default forwardRef(FriendlyCaptchaProvider);
