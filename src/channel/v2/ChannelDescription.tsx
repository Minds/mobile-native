import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
// import ReadMore from 'react-native-read-more-text';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import i18n from '../../common/services/i18n.service';
import type UserModel from '../UserModel';
import ReadMore from '../../common/components/ReadMore';
import { withErrorBoundary } from '../../common/components/ErrorBoundary';
import MText from '../../common/components/MText';

type PropsType = {
  channel: UserModel;
};

/**
 * Channel description with read more and fade
 * @param props
 */
const ChannelDescription = withErrorBoundary((props: PropsType) => {
  const navigation = useNavigation();
  const theme = ThemedStyles.style;
  const backgroundColor = ThemedStyles.getColor('PrimaryBackground');
  const startColor = (ThemedStyles.theme ? '#242A30' : '#F5F5F5') + '00';
  const endColor = backgroundColor + 'FF';

  const renderRevealedFooter = useCallback(
    (handlePress): React.ReactNode => {
      return (
        <MText
          style={[theme.fontL, theme.bold, theme.colorLink, theme.marginTop2x]}
          onPress={handlePress}>
          {i18n.t('showLess')}
        </MText>
      );
    },
    [theme],
  );

  const renderTruncatedFooter = useCallback(
    (handlePress): React.ReactNode => {
      return (
        <TouchableOpacity onPress={handlePress} style={styles.touchable}>
          <LinearGradient
            colors={[startColor, endColor]}
            style={styles.linear}
          />
        </TouchableOpacity>
      );
    },
    [startColor, endColor],
  );

  return (
    <ReadMore
      numberOfLines={4}
      text={props.channel.briefdescription}
      renderTruncatedFooter={renderTruncatedFooter}
      style={[theme.fontM, theme.colorSecondaryText]}
      navigation={navigation}
      renderRevealedFooter={renderRevealedFooter}
    />
  );
});

export default ChannelDescription;

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
    height: 52,
    width: '100%',
    top: -52,
  },
  linear: {
    height: 52,
    width: '100%',
  },
});
