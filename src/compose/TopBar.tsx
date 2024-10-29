import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { Flow } from 'react-native-animated-spinkit';
import { IconButton } from '~ui/icons';
import MText from '../common/components/MText';
import { Spacer } from '../common/ui';
import sp from '~/services/serviceProvider';
import { useMemoStyle } from '~/styles/hooks';

/**
 * Compose Top bar
 */
export default observer(function (props) {
  const theme = sp.styles.style;
  const backIconName = props.backIconName || 'close';
  const backIconSize = props.backIconSize || 30;
  const containerStyle = useMemoStyle(
    [styles.topBar, props.containerStyle],
    [props.containerStyle],
  );

  return (
    <View style={containerStyle}>
      <IconButton
        size={backIconSize}
        name={backIconName}
        style={styles.back}
        onPress={props.onPressBack}
        testID="topbarBack"
      />
      {props.leftComponent}
      {props.leftText && (
        <MText style={styles.leftText}>{props.leftText}</MText>
      )}
      <View style={theme.flexContainer} />
      <Spacer right="L">
        {props.store.posting ? (
          <View style={styles.dotIndicatorContainerStyle}>
            <Flow color={sp.styles.getColor('SecondaryText')} />
          </View>
        ) : typeof props.rightText === 'string' ? (
          <MText
            style={styles.postButton}
            onPress={props.onPressRight}
            testID="topBarDone">
            {props.rightText}
          </MText>
        ) : (
          props.rightText
        )}
      </Spacer>
    </View>
  );
});

const styles = sp.styles.create({
  dotIndicatorContainerStyle: ['rowJustifyEnd'],
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  leftText: [
    'textCenter',
    {
      position: 'absolute',
      textAlign: 'center',
      fontSize: 20,
    },
  ],
  postButton: {
    textAlign: 'right',
    fontSize: 18,
  },
  back: ['colorIcon', 'paddingLeft2x', 'paddingRight2x'],
});
