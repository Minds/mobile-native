import React from 'react';
import * as entities from 'entities';
import { Alert, Clipboard } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { showNotification } from '../../../AppMessages';

import BottomButtonOptions, {
  ItemType,
} from '../../common/components/BottomButtonOptions';
import type CommentModel from './CommentModel';
import type CommentsStore from './CommentsStore';
import type BlogModel from '../../blogs/BlogModel';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import type GroupModel from '../../groups/GroupModel';
import type ActivityModel from '../../newsfeed/ActivityModel';
import sessionService from '../../common/services/session.service';

type PropsType = {
  comment: CommentModel;
  store: CommentsStore;
  entity: ActivityModel | BlogModel | GroupModel;
};

/**
 * Comments options menu
 */
export default observer(function CommentBottomMenu({
  comment,
  entity,
  store,
}: PropsType) {
  const theme = ThemedStyles.style;

  const localStore = useLocalStore(() => ({
    showMenu: false,
    show() {
      localStore.showMenu = true;
    },
    hide() {
      localStore.showMenu = false;
    },
  }));

  const navigation = useNavigation<any>();

  const dismissOptions: Array<Array<ItemType>> = React.useMemo(() => {
    const actions: Array<Array<ItemType>> = [[]];

    const deleteOpt: ItemType = {
      title: i18n.t('delete'),
      onPress: () => {
        Alert.alert(
          i18n.t('confirm'),
          i18n.t('confirmNoUndo'),
          [
            { text: i18n.t('no'), style: 'cancel', onPress: localStore.hide },
            {
              text: i18n.t('yesImSure'),
              onPress: () => {
                localStore.hide();
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

    const setExplicit: ItemType = {
      title: i18n.t('setExplicit'),
      onPress: () => {
        store.commentToggleExplicit(comment.guid);
        localStore.hide();
      },
    };
    const removeExplicit: ItemType = {
      title: i18n.t('removeExplicit'),
      onPress: () => {
        store.commentToggleExplicit(comment.guid);
        localStore.hide();
      },
    };

    if (comment.isOwner()) {
      actions[0].push({
        title: i18n.t('edit'),
        onPress: () => {
          localStore.hide();
          store.setShowInput(true, comment);
        },
      });

      actions[0].push(deleteOpt);

      if (!comment.mature) {
        actions[0].push(setExplicit);
      } else {
        actions[0].push(removeExplicit);
      }
    } else {
      if (sessionService.getUser().isAdmin()) {
        actions[0].push(deleteOpt);

        if (!comment.mature) {
          actions[0].push(setExplicit);
        } else {
          actions[0].push(removeExplicit);
        }
      } else if (entity.isOwner()) {
        actions[0].push(deleteOpt);
      }

      actions[0].push({
        title: i18n.t('report'),
        onPress: () => {
          navigation.push('Report', { entity: comment });
          localStore.hide();
        },
      });
      actions[0].push({
        title: i18n.t('copy'),
        onPress: () => {
          Clipboard.setString(entities.decodeHTML(comment.description || ''));
          showNotification(i18n.t('copied'), 'info');
          localStore.hide();
        },
      });
    }

    actions.push([
      {
        title: i18n.t('cancel'),
        titleStyle: theme.colorSecondaryText,
        onPress: localStore.hide,
      },
    ]);
    return actions;
  }, [
    comment,
    entity,
    localStore,
    navigation,
    store,
    theme.colorSecondaryText,
  ]);

  return (
    <>
      <Icon
        name="more-vert"
        onPress={localStore.show}
        size={18}
        style={theme.colorTertiaryText}
      />
      <BottomButtonOptions
        list={dismissOptions}
        isVisible={localStore.showMenu}
      />
    </>
  );
});
