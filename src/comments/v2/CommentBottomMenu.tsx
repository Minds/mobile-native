import React from 'react';
import * as entities from 'entities';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';

import { showNotification } from '../../../AppMessages';

import type CommentModel from './CommentModel';
import type CommentsStore from './CommentsStore';
import type BlogModel from '../../blogs/BlogModel';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import type GroupModel from '../../groups/GroupModel';
import type ActivityModel from '../../newsfeed/ActivityModel';
import sessionService from '../../common/services/session.service';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { MenuItemProps } from '../../common/components/bottom-sheet/MenuItem';
import {
  BottomSheetModal,
  BottomSheetButton,
  MenuItem,
} from '../../common/components/bottom-sheet';

type PropsType = {
  comment: CommentModel;
  store: CommentsStore;
  entity: ActivityModel | BlogModel | GroupModel;
  onTranslate: () => void;
};

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * Comments options menu
 */
export default function CommentBottomMenu({
  comment,
  entity,
  store,
  onTranslate,
}: PropsType) {
  const theme = ThemedStyles.style;

  const navigation = useNavigation<any>();
  // Do not render BottomSheet unless it is necessary
  const [shown, setShown] = React.useState(false);

  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  const show = React.useCallback(() => {
    if (shown) {
      ref.current?.present();
    } else {
      setShown(true);
    }
  }, [shown]);

  const dismissOptions: Array<MenuItemProps> = React.useMemo(() => {
    const actions: Array<MenuItemProps> = [
      {
        title: i18n.t('translate.translate'),
        iconName: 'translate',
        iconType: 'material',
        onPress: () => {
          close();
          onTranslate();
        },
      },
    ];

    const deleteOpt: MenuItemProps = {
      title: i18n.t('delete'),
      iconName: 'delete',
      iconType: 'material-community',
      onPress: () => {
        Alert.alert(
          i18n.t('confirm'),
          i18n.t('confirmNoUndo'),
          [
            { text: i18n.t('no'), style: 'cancel', onPress: close },
            {
              text: i18n.t('yesImSure'),
              onPress: () => {
                close();
                store
                  .delete(comment.guid)
                  .then(() => {
                    showNotification(
                      i18n.t('comments.successRemoving'),
                      'success',
                    );
                  })
                  .catch(() => {
                    showNotification(i18n.t('comments.errorRemoving'));
                  });
              },
            },
          ],
          { cancelable: false },
        );
      },
    };

    const setExplicit: MenuItemProps = {
      title: i18n.t('setExplicit'),
      iconName: 'explicit',
      iconType: 'material',
      onPress: () => {
        store.commentToggleExplicit(comment.guid);
        close();
      },
    };
    const removeExplicit: MenuItemProps = {
      title: i18n.t('removeExplicit'),
      iconName: 'explicit',
      iconType: 'material',
      onPress: () => {
        store.commentToggleExplicit(comment.guid);
        close();
      },
    };

    if (comment.isOwner()) {
      actions.push({
        title: i18n.t('edit'),
        iconName: 'edit',
        iconType: 'material',
        onPress: () => {
          close();
          // we delay showing the input to prevent the keyboard to be hidden
          setTimeout(() => store.setShowInput(true, comment), 300);
        },
      });

      actions.push(deleteOpt);

      if (!comment.mature) {
        actions.push(setExplicit);
      } else {
        actions.push(removeExplicit);
      }
    } else {
      if (sessionService.getUser().isAdmin()) {
        actions.push(deleteOpt);

        if (!comment.mature) {
          actions.push(setExplicit);
        } else {
          actions.push(removeExplicit);
        }
      } else if (entity.isOwner()) {
        actions.push(deleteOpt);
      }

      actions.push({
        title: i18n.t('report'),
        iconName: 'ios-flag-outline',
        iconType: 'ionicon',
        onPress: () => {
          navigation.push('Report', { entity: comment });
          close();
        },
      });
      actions.push({
        title: i18n.t('copy'),
        iconName: 'content-copy',
        iconType: 'material',
        onPress: () => {
          Clipboard.setString(entities.decodeHTML(comment.description || ''));
          showNotification(i18n.t('copied'), 'info');
          close();
        },
      });
    }
    return actions;
  }, [close, comment, entity, navigation, onTranslate, store]);

  return (
    <TouchableOpacity onPress={show} hitSlop={hitSlop}>
      <Icon name="more-vert" size={18} style={theme.colorTertiaryText} />
      {shown && (
        <BottomSheetModal ref={ref} autoShow>
          {dismissOptions.map((a, i) => (
            <MenuItem {...a} key={i} />
          ))}
          <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
        </BottomSheetModal>
      )}
    </TouchableOpacity>
  );
}
