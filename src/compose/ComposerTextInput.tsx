import React from 'react';
import { TextInput as TextInputType } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles, { useMemoStyle } from '../styles/ThemedStyles';
import Tags from '../common/components/Tags';
import TextInput from '../common/components/TextInput';
import { ComposeStoreType } from './useComposeStore';
import onImageInput from '~/common/helpers/onImageInput';

export const ComposerTextInput = observer(
  React.forwardRef<
    TextInputType,
    {
      store: ComposeStoreType;
      navigation: any;
      placeholder: string;
    }
  >(({ store, navigation, placeholder }, ref) => {
    // Local store
    const localStore = useLocalStore(() => ({
      height: 50,
      onSizeChange(e) {
        // adding 30 to prevent textinput flickering after a new line.
        // but we should have a logic for this number, maybe the height of the header?
        // floor to avoid re-renders on ios
        const height = Math.floor(e.nativeEvent.contentSize.height + 30);
        if (localStore.height !== height) {
          localStore.height = height;
        }
      },
    }));

    const inputStyle = useMemoStyle(
      [
        'fullWidth',
        'colorPrimaryText',
        'fontXXL',
        {
          textAlignVertical: 'top',
          paddingTop: 8,
          height: localStore.height,
        },
      ],
      [localStore.height],
    );
    return (
      <TextInput
        style={inputStyle}
        onContentSizeChange={localStore.onSizeChange}
        ref={ref}
        scrollEnabled={false}
        placeholder={placeholder}
        placeholderTextColor={ThemedStyles.getColor('TertiaryText')}
        onChangeText={store.setText}
        keyboardType={'default'}
        textAlignVertical="top"
        multiline={true}
        autoFocus={true}
        selectTextOnFocus={false}
        underlineColorAndroid="transparent"
        onSelectionChange={store.selectionChanged}
        onImageChange={onImageInput(store.onMediaFromGallery)}
        testID="PostInput">
        <InputText store={store} navigation={navigation} />
      </TextInput>
    );
  }),
);

const InputText = observer(({ store, navigation }) => (
  <Tags
    navigation={navigation}
    selectable={true}
    style={
      store.attachments.hasAttachment || store.text.length > 85
        ? ThemedStyles.style.fontXL
        : ThemedStyles.style.fontXXL
    }>
    {store.text}
  </Tags>
));
