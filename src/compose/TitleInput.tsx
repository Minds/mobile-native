import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import TextInput from '../common/components/TextInput';
import i18nService from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import { IS_IOS } from '../config/Config';

/**
 * Title input
 * @param {Object} props
 */
export default observer(function TitleInput(props) {
  return (
    <View style={container}>
      <TextInput
        autoFocus
        style={textInputStyle}
        placeholder={i18nService.t('title')}
        placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
        onChangeText={props.store.setTitle}
        textAlignVertical="top"
        value={props.store.title}
        multiline
        selectTextOnFocus={false}
        underlineColorAndroid="transparent"
        testID="PostTitleInput"
      />
    </View>
  );
});

const textInputStyle = ThemedStyles.combine(
  'colorPrimaryText',
  'fontXXL',
  'bold',
);
const container = ThemedStyles.combine(
  'fullWidth',
  'marginBottom',
  IS_IOS ? 'marginTop' : 'marginBottom',
);
