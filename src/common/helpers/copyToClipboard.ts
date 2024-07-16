import * as Clipboard from 'expo-clipboard';
import { showNotification } from 'AppMessages';
import sp from '~/services/serviceProvider';

export const copyToClipboardOptions = (text: string, onClose?: () => void) => ({
  iconName: 'content-copy',
  iconType: 'material-community',
  title: sp.i18n.t('copyLink'),
  onPress: () => {
    copyToClipboard(text);
    onClose?.();
  },
});

export const copyToClipboard = (text?: string) => {
  if (!text) return;
  Clipboard.setStringAsync(text);
  showNotification(sp.i18n.t('linkCopied'));
};
