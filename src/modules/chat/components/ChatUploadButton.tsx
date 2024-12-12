import { useCallback } from 'react';
import { Insets, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import Touchable from '~/common/components/Touchable';
import { PickedMedia } from '~/common/services/image-picker.service';
import sp from '~/services/serviceProvider';

/** Chat uplod button props. */
type ChatUploadButtonProps = {
  onUploadImage: (image: PickedMedia) => Promise<void>;
  onUploadingStateChange: (isUploading: boolean) => void;
  hitSlop?: Insets;
};

/**
 * Chat upload button - allows files to be uploaded from ImagePicker.
 * @param { ChatUploadButtonProps } props - Chat upload button props.
 * @returns Chat upload button.
 */
const ChatUploadButton = ({
  onUploadingStateChange,
  onUploadImage,
  hitSlop = undefined,
}: ChatUploadButtonProps) => {
  /**
   * Pick an image, and call prop provided function to upload it.
   * @returns { Promise<void> }
   */
  const uploadImage = useCallback(async (): Promise<void> => {
    try {
      const result = await sp.resolve('imagePicker').launchImageLibrary({
        type: 'Images',
        crop: false,
        maxFiles: 1,
      });
      if (!result) return;
      onUploadingStateChange(true);
      await onUploadImage(result[0]);
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      onUploadingStateChange(false);
    }
  }, [sp, onUploadImage]);

  return (
    <Touchable
      onPress={uploadImage}
      hitSlop={hitSlop}
      style={styles.uploadIcon}
      testID="UploadChatImageButton">
      <Icon name="image" size={20} style={sp.styles.style.colorSecondaryText} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  uploadIcon: {
    marginRight: 15,
    paddingBottom: 7,
  },
});

export default ChatUploadButton;
