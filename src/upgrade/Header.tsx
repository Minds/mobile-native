import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import FadeView from '../common/components/FadeView';
import MText from '../common/components/MText';

import sp from '../services/serviceProvider';

type PropsType = {
  pro: boolean | undefined;
};

const Header = ({ pro }: PropsType) => {
  const texts = pro ? 'pro' : 'plus';
  const i18n = sp.i18n;
  return (
    <ImageBackground
      style={styles.banner}
      source={require('../assets/plus-image.png')}
      resizeMode="cover">
      {sp.styles.theme === 1 && (
        <FadeView
          style={sp.styles.style.positionAbsoluteBottom}
          fades={['bottom']}
          fadeLength={200}
          backgroundColor={sp.styles.getColor('SecondaryBackground')}
        />
      )}
      <View style={styles.textContainer}>
        <MText style={styles.minds}>
          {i18n.t(`monetize.${texts}`).toUpperCase()}
        </MText>
        <MText style={styles.title}>{i18n.t(`monetize.${texts}Title`)}</MText>
        <MText style={styles.text}>
          {i18n.t(`monetize.${texts}Description`)}
        </MText>
      </View>
    </ImageBackground>
  );
};

const bannerAspectRatio = 1.3;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  minds: {
    color: '#FFFFFF',
    fontSize: 17,
    paddingBottom: 5,
    fontFamily: 'Roboto_900Black',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    marginVertical: 15,
  },
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
  },
});

export default Header;
