import React, { useCallback, useRef } from 'react';
import {
  Clipboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showNotification } from '../../../AppMessages';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

interface InputProps {
  textToCopy: string;
  label: string;
  style?: any;
}

const Input = ({ textToCopy, label, style }: InputProps) => {
  const theme = ThemedStyles.style;
  const _textInput = useRef<TextInput>();

  const _onFocus = useCallback(() => {
    _textInput.current!.focus();
    Clipboard.setString(textToCopy);
    showNotification(i18n.t('copied'), 'info', 3000, 'top');
  }, [textToCopy]);

  return (
    <View style={style}>
      <Text>{label}</Text>
      <View style={[theme.marginTop2x, styles.inputContainer]}>
        <TextInput
          ref={(ref) => (_textInput.current = ref!)}
          selectTextOnFocus
          caretHidden
          textContentType={'URL'}
          textBreakStrategy={'highQuality'}
          collapsable
          autoCorrect={false}
          style={[
            theme.fieldTextInput,
            theme.input,
            theme.backgroundSecondary,
            theme.padding2x,
            theme.fontM,
            styles.borderRadius,
          ]}
          value={textToCopy}
        />
        <Text
          style={[
            theme.colorLink,
            theme.backgroundSecondary,
            theme.paddingLeft2x,
            { position: 'absolute', right: 16 },
          ]}>
          {i18n.t('copy')}
        </Text>
        <TouchableOpacity
          onPress={_onFocus}
          activeOpacity={1}
          style={[theme.positionAbsolute]}
        />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  borderRadius: {
    borderRadius: 3,
  },
  inputContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
