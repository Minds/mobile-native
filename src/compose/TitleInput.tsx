import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import TextInput from '../common/components/TextInput';

import { IS_IOS } from '../config/Config';
import sp from '../services/serviceProvider';

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
        placeholder={sp.i18n.t('title')}
        placeholderTextColor={sp.styles.getColor('TertiaryText')}
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

const textInputStyle = sp.styles.combine('colorPrimaryText', 'fontXXL', 'bold');
const container = sp.styles.combine(
  'fullWidth',
  'marginBottom',
  IS_IOS ? 'marginTop' : 'marginBottom',
);
