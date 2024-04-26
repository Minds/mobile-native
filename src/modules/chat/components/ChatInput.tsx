import React, { useState } from 'react';
import type { TextInput as TextInputType } from 'react-native';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { Flow } from 'react-native-animated-spinkit';

import KeyboardSpacingView from '~/common/components/keyboard/KeyboardSpacingView';
import ThemedStyles from '~/styles/ThemedStyles';
import preventDoubleTap from '~/common/components/PreventDoubleTap';
import { CHAR_LIMIT } from '~/config/Config';
import TextInput from '~/common/components/TextInput';
import Tags from '~/common/components/Tags';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const Touchable = preventDoubleTap(TouchableOpacity);

type Props = {
  onSendMessage: (text: string) => void;
};

/**
 * Floating Input component
 */
// TODO: Optimize this component (Reduce re-renders)
const ChatInput = ({ onSendMessage }: Props) => {
  const navigation = useNavigation();
  const theme = ThemedStyles.style;
  const ref = React.useRef<TextInputType>(null);
  const [text, setText] = useState('');

  const inputMaxHeight = {
    maxHeight: height * 0.2,
  };

  const saving = false;

  const send = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onSendMessage(trimmedText);
    setText('');
  };

  return (
    <KeyboardSpacingView
      enabled
      pointerEvents="box-none"
      style={[theme.borderTopHair, theme.bcolorPrimaryBorder]}>
      <View
        style={[
          theme.bgSecondaryBackground,
          styles.inputContainer,
          theme.paddingVertical3x,
          theme.paddingHorizontal4x,
          theme.borderRadius30x,
          theme.marginHorizontal4x,
          theme.marginVertical3x,
        ]}>
        <View
          style={[
            theme.rowJustifyStart,
            theme.alignEnd,
            theme.paddingHorizontal4x,
          ]}>
          <TextInput
            testID="CommentTextInput"
            ref={ref}
            multiline={true}
            editable={!saving}
            scrollEnabled={true}
            placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
            placeholder="type your message ..."
            underlineColorAndroid="transparent"
            onChangeText={setText}
            keyboardType={'default'}
            maxLength={CHAR_LIMIT}
            style={[
              theme.fullWidth,
              theme.colorPrimaryText,
              theme.fontL,
              styles.input,
              inputMaxHeight,
            ]}>
            <Tags navigation={navigation} selectable={true}>
              {text}
            </Tags>
          </TextInput>
          {!saving ? (
            <Touchable
              onPress={send}
              style={styles.sendIcon}
              testID="PostCommentButton">
              <Icon name="md-send" size={18} style={theme.colorSecondaryText} />
            </Touchable>
          ) : (
            <View style={[theme.alignSelfCenter, theme.justifyEnd]}>
              <Flow color={ThemedStyles.getColor('PrimaryText')} />
            </View>
          )}
        </View>
      </View>
    </KeyboardSpacingView>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  sendIcon: {
    paddingBottom: 7,
  },
  input: {
    minHeight: 35,
    flex: 3,
    lineHeight: 22,
  },
  inputContainer: {
    maxHeight: height * 0.4,
  },
});
