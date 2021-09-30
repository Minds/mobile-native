import React, { useCallback, useRef } from 'react';
import {
  StyleSheet,
  TextInput as TextInputType,
  TouchableOpacity,
  View,
} from 'react-native';
import { showNotification } from '../../../AppMessages';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Clipboard from '@react-native-clipboard/clipboard';
import TextInput from '../../common/components/TextInput';
import MText from '../../common/components/MText';

interface InputProps {
  textToCopy: string;
  label: string;
  style?: any;
}

const Input = ({ textToCopy, label, style }: InputProps) => {
  const theme = ThemedStyles.style;
  const _textInput = useRef<TextInputType>();

  const _onFocus = useCallback(() => {
    _textInput.current!.focus();
    Clipboard.setString(textToCopy);
    showNotification(i18n.t('copied'), 'info', 3000, 'top');
  }, [textToCopy]);

  return (
    <View style={style}>
      <MText>{label}</MText>
      <View style={[theme.marginTop2x, styles.inputContainer]}>
        <TextInput
          ref={ref => (_textInput.current = ref!)}
          selectTextOnFocus
          caretHidden
          textContentType={'URL'}
          textBreakStrategy={'highQuality'}
          collapsable
          autoCorrect={false}
          style={[
            theme.input,
            theme.bgSecondaryBackground,
            theme.padding2x,
            theme.fontM,
            styles.input,
          ]}
          value={textToCopy}
        />
        <MText
          style={[
            theme.colorLink,
            theme.bgSecondaryBackground,
            theme.paddingHorizontal4x,
            styles.copyText,
          ]}
        >
          {i18n.t('copy')}
        </MText>
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
  input: {
    borderRadius: 3,
    lineHeight: 17,
  },
  inputContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  copyText: { position: 'absolute', right: 1 },
});
