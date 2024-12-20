import React from 'react';
import * as entities from 'entities';
import { Alert } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';

import { showNotification } from '../../../AppMessages';

import type CommentModel from './CommentModel';
import type CommentsStore from './CommentsStore';
import type BlogModel from '../../blogs/BlogModel';

import type GroupModel from '../../groups/GroupModel';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
  BottomSheetMenuItemProps,
} from '../../common/components/bottom-sheet';
import { useGroupContext } from '~/modules/groups/contexts/GroupContext';
import sp from '~/services/serviceProvider';
import { useSetCommentPinnedState } from './hooks/useSetCommentPinnedState';

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
  const theme = sp.styles.style;
  const group = useGroupContext()?.group;
  const i18n = sp.i18n;

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

  const { setCommentPinnedState } = useSetCommentPinnedState(store);

  const dismissOptions: Array<BottomSheetMenuItemProps> = React.useMemo(() => {
    const actions: Array<BottomSheetMenuItemProps> = [
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

    const deleteOpt: BottomSheetMenuItemProps = {
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

    const setExplicit: BottomSheetMenuItemProps = {
      title: i18n.t('setExplicit'),
      iconName: 'explicit',
      iconType: 'material',
      onPress: () => {
        store.commentToggleExplicit(comment.guid);
        close();
      },
    };
    const removeExplicit: BottomSheetMenuItemProps = {
      title: i18n.t('removeExplicit'),
      iconName: 'explicit',
      iconType: 'material',
      onPress: () => {
        store.commentToggleExplicit(comment.guid);
        close();
      },
    };

    if (entity.isOwner() && !store.parent) {
      actions.push({
        title: !comment.pinned ? i18n.t('pin') : i18n.t('unpin'),
        iconName: 'push-pin',
        iconType: 'material',
        onPress: () => {
          setCommentPinnedState(comment.guid, !comment.pinned);
          close();
        },
      });
    }

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
      if (sp.session.getUser().isAdmin()) {
        actions.push(deleteOpt);

        if (!comment.mature) {
          actions.push(setExplicit);
        } else {
          actions.push(removeExplicit);
        }
      } else if (
        entity.isOwner() ||
        (group && (group['is:owner'] || group['is:moderator']))
      ) {
        actions.push(deleteOpt);
      }

      actions.push({
        title: i18n.t('report'),
        iconName: 'flag-outline',
        iconType: 'ionicon',
        onPress: () => {
          sp.navigation.push('Report', { entity: comment });
          close();
        },
      });
      actions.push({
        title: i18n.t('copy'),
        iconName: 'content-copy',
        iconType: 'material',
        onPress: () => {
          Clipboard.setStringAsync(
            entities.decodeHTML(comment.description || ''),
          );
          showNotification(i18n.t('copied'), 'info');
          close();
        },
      });
    }
    return actions;
  }, [i18n, comment, close, onTranslate, store, entity, group, comment.pinned]);

  return (
    <TouchableOpacity onPress={show} hitSlop={hitSlop}>
      <Icon name="more-vert" size={18} style={theme.colorTertiaryText} />
      {shown && (
        <BottomSheetModal ref={ref} autoShow>
          {dismissOptions.map((a, i) => (
            <BottomSheetMenuItem {...a} key={i} />
          ))}
          <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
        </BottomSheetModal>
      )}
    </TouchableOpacity>
  );
}
