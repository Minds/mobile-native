import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BottomButtonOptions, {
  ItemType,
} from '../../common/components/BottomButtonOptions';
import type CommentsStore from './CommentsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { StyleProp, ViewStyle } from 'react-native';

type PropsType = {
  store: CommentsStore;
  containerStyle?: StyleProp<ViewStyle>;
  afterSelected: () => void;
  beforeSelect: () => void;
};

/**
 * Comments options menu
 */
export default observer(function CommentInputBottomMenu({
  store,
  afterSelected,
  beforeSelect,
}: PropsType) {
  const theme = ThemedStyles.style;

  const localStore = useLocalStore(() => ({
    showMenu: false,
    show() {
      beforeSelect();
      localStore.showMenu = true;
    },
    hide() {
      localStore.showMenu = false;
    },
  }));

  const dismissOptions: Array<Array<ItemType>> = React.useMemo(() => {
    const actions: Array<Array<ItemType>> = [[]];

    const setExplicit: ItemType = {
      title: i18n.t('setExplicit'),
      onPress: () => {
        store.toggleMature();
        localStore.hide();
      },
    };
    const removeExplicit: ItemType = {
      title: i18n.t('removeExplicit'),
      onPress: () => {
        store.toggleMature();
        localStore.hide();
      },
    };

    const openGallery: ItemType = {
      title: i18n.t('capture.attach'),
      onPress: () => {
        const fn = () => {
          localStore.hide();
          afterSelected();
        };
        store.gallery(fn);
      },
    };

    const openPhoto: ItemType = {
      title: i18n.t('capture.takePhoto'),
      onPress: () => {
        localStore.hide();
        store.photo(afterSelected);
      },
    };

    actions[0].push(openGallery);
    actions[0].push(openPhoto);

    if (!store.mature) {
      actions[0].push(setExplicit);
    } else {
      actions[0].push(removeExplicit);
    }

    actions.push([
      {
        title: i18n.t('cancel'),
        titleStyle: theme.colorSecondaryText,
        onPress: localStore.hide,
      },
    ]);
    return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterSelected, localStore, store.mature, theme.colorSecondaryText]);

  return (
    <TouchableOpacity onPress={localStore.show}>
      <Icon name="more-vert" size={18} style={theme.colorTertiaryText} />
      <BottomButtonOptions
        list={dismissOptions}
        isVisible={localStore.showMenu}
      />
    </TouchableOpacity>
  );
});
