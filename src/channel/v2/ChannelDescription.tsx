import React, { useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import ReadMore from 'react-native-read-more-text';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import i18n from '../../common/services/i18n.service';
import Tags from '../../common/components/Tags';
import type UserModel from '../UserModel';

type PropsType = {
  channel: UserModel;
};

/**
 * Channel description with read more and fade
 * @param props
 */
const ChannelDescription = (props: PropsType) => {
  const navigation = useNavigation();
  const theme = ThemedStyles.style;
  const backgroundColor = ThemedStyles.getColor('secondary_background');
  const startColor = backgroundColor + '00';
  const endColor = backgroundColor + 'FF';

  const renderRevealedFooter = useCallback(
    (handlePress) => {
      return (
        <Text
          style={[theme.fontL, theme.bold, theme.colorLink, theme.marginTop2x]}
          onPress={handlePress}>
          {i18n.t('showLess')}
        </Text>
      );
    },
    [theme],
  );

  const renderTruncatedFooter = useCallback(
    (handlePress) => {
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
      renderTruncatedFooter={renderTruncatedFooter}
      renderRevealedFooter={renderRevealedFooter}>
      <Tags
        // style={[theme.fontL, theme.colorSecondaryText]} disabled because of the android issue
        navigation={navigation}>
        {props.channel.briefdescription}
      </Tags>
    </ReadMore>
  );
};

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
