import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { useSafeArea } from 'react-native-safe-area-context';
import { DotIndicator } from 'react-native-reanimated-indicators';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';

/**
 * Compose Top bar
 */
export default observer(function(props) {
  const theme = ThemedStyles.style;
  const insets = useSafeArea();
  const menuStyle = { paddingTop: insets.top || 5 };

  return (
    <View style={[styles.topBar, menuStyle]}>
      <MIcon
        size={45}
        name="chevron-left"
        style={[styles.backIcon, theme.colorWhite]}
        onPress={props.onPressBack}
      />
      {props.leftText && (
        <Text style={styles.leftText}>
          {props.leftText}
        </Text>
      )}
      <View style={theme.flexContainer} />
      {props.store.posting ? (
        <DotIndicator
          containerStyle={[theme.rowJustifyEnd, theme.marginRight4x]}
          color={ThemedStyles.getColor('secondary_text')}
          scaleEnabled={true}
        />
      ) : (
        props.rightText && (
          <Text style={styles.postButton} onPress={props.onPressRight}>
            {props.rightText}
          </Text>
        )
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    shadowOpacity: 2,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  leftText: {
    textAlign: 'left',
    fontSize: 26,
  },
  postButton: {
    textAlign: 'right',
    fontSize: 20,
    paddingRight: 20,
  },
});

