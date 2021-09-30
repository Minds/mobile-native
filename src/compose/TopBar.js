import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { useSafeArea } from 'react-native-safe-area-context';
import { DotIndicator } from 'react-native-reanimated-indicators';
import { IconButton } from '~ui/icons';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';

/**
 * Compose Top bar
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const insets = useSafeArea();
  const menuStyle = [{ paddingTop: insets.top || 5 }, props.containerStyle];

  const backIconName = props.backIconName || 'chevron-left';
  const backIconSize = props.backIconSize || 45;

  return (
    <View style={[styles.topBar, menuStyle]}>
      <IconButton
        size={backIconSize}
        name={backIconName}
        style={theme.colorPrimaryText}
        onPress={props.onPressBack}
        testID="topbarBack"
        marginLeft="2x"
      />
      {props.leftText && (
        <MText style={styles.leftText}>{props.leftText}</MText>
      )}
      <View style={theme.flexContainer} />
      {props.store.posting ? (
        <DotIndicator
          containerStyle={[theme.rowJustifyEnd, theme.marginRight4x]}
          color={ThemedStyles.getColor('SecondaryText')}
          scaleEnabled={true}
        />
      ) : (
        props.rightText && (
          <MText
            style={styles.postButton}
            onPress={props.onPressRight}
            testID="topBarDone"
          >
            {props.rightText}
          </MText>
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
