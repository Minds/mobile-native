import React from 'react';
import { observer } from 'mobx-react';
import Icon from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import type CommentsStore from './CommentsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { StyleProp, ViewStyle } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
  BottomSheetMenuItemProps,
} from '../../common/components/bottom-sheet';
import PermissionsService from '~/common/services/permissions.service';

type PropsType = {
  store: CommentsStore;
  containerStyle?: StyleProp<ViewStyle>;
  afterSelected: () => void;
  beforeSelect: () => void;
};

const slop = { top: 10, bottom: 10, left: 0, right: 10 };

/**
 * Comments options menu
 */
export default observer(function CommentInputBottomMenu({
  store,
  afterSelected,
  beforeSelect,
}: PropsType) {
  const theme = ThemedStyles.style;

  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  const show = React.useCallback(() => {
    beforeSelect();
    ref.current?.present();
  }, [beforeSelect]);

  const dismissOptions: Array<BottomSheetMenuItemProps> = React.useMemo(() => {
    const actions: Array<BottomSheetMenuItemProps> = [];

    const setExplicit: BottomSheetMenuItemProps = {
      title: i18n.t('setExplicit'),
      onPress: () => {
        store.toggleMature();
        close();
      },
      iconName: 'explicit',
      iconType: 'material',
    };

    const removeExplicit: BottomSheetMenuItemProps = {
      title: i18n.t('removeExplicit'),
      onPress: () => {
        store.toggleMature();
        close();
      },
      iconName: 'explicit',
      iconType: 'material',
    };

    const shouldHideVideoUpload = PermissionsService.shouldHideUploadVideo();

    const openGallery: BottomSheetMenuItemProps = {
      title: i18n.t(
        shouldHideVideoUpload ? 'capture.attachPhoto' : 'capture.attach',
      ),
      onPress: () => {
        const fn = () => {
          close();
          afterSelected();
        };
        store.gallery(fn);
      },
      iconName: 'photo-library',
      iconType: 'material',
    };

    const openPhoto: BottomSheetMenuItemProps = {
      title: i18n.t('capture.takePhoto'),
      onPress: () => {
        close();
        store.photo(afterSelected);
      },
      iconName: 'photo-camera',
      iconType: 'material',
    };

    actions.push(openGallery);
    actions.push(openPhoto);

    if (!store.mature) {
      actions.push(setExplicit);
    } else {
      actions.push(removeExplicit);
    }

    return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterSelected, store.mature, theme.colorSecondaryText]);

  return (
    <TouchableOpacity onPress={show} hitSlop={slop}>
      <Icon name="more-vert" size={18} style={theme.colorTertiaryText} />
      <BottomSheetModal ref={ref}>
        {dismissOptions.map((a, i) => (
          <BottomSheetMenuItem {...a} key={i} />
        ))}
        <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
      </BottomSheetModal>
    </TouchableOpacity>
  );
});
