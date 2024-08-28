import React, { useCallback } from 'react';
import { observer } from 'mobx-react';

import { IconButtonNext } from '~ui/icons';
import { FLAG_REMIND } from '~/common/Permissions';
import ActivityModel from '~/newsfeed/ActivityModel';
import type BlogModel from '~/blogs/BlogModel';
import createComposeStore, {
  ComposeAudience,
} from '~/compose/createComposeStore';
import { pushAudienceSelector } from '~/compose/ComposeAudienceSelector';
import { showNotification } from '~/../AppMessages';
import { actionsContainerStyle } from './styles';
import { useLegacyStores } from '~/common/hooks/use-stores';
import {
  BottomSheetButton,
  BottomSheetMenuItem,
  pushBottomSheet,
} from '~/common/components/bottom-sheet';
import EntityCounter from './EntityCounter';
import { useAnalytics } from '~/common/contexts/analytics.context';

import type NewsfeedStore from '../../NewsfeedStore';
import getNetworkError from '~/common/helpers/getNetworkError';
import serviceProvider from '~/services/serviceProvider';

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  hideCount?: boolean;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default observer(function ({ entity, hideCount }: PropsTypes) {
  const disabled = !entity.can(FLAG_REMIND);
  const permissions = serviceProvider.permissions;
  const { newsfeed } = useLegacyStores();
  const analytics = useAnalytics();

  const shouldShow = !(
    permissions.shouldHideInteract() && permissions.shouldHideCreatePost()
  );

  const showDropdown = useCallback(() => {
    pushRemindActionSheet({
      entity,
      newsfeed,
      analytics,
    });
  }, [entity, newsfeed, analytics]);

  return shouldShow ? (
    <IconButtonNext
      testID="Remind activity button"
      style={actionsContainerStyle}
      scale
      disabled={disabled}
      name="remind"
      size="small"
      fill
      active={entity.has_reminded ?? false}
      onPress={showDropdown}
      extra={
        !hideCount && entity.reminds ? (
          <EntityCounter entity={entity} countProperty="reminds" />
        ) : null
      }
    />
  ) : null;
});

const pushRemindActionSheet = async ({
  entity,
  analytics,
}: {
  entity: ActivityModel;
  newsfeed: NewsfeedStore;
  analytics;
}) => {
  const i18n = serviceProvider.i18n;
  /**
   * Open quote in composer
   */
  const quote = () => {
    // check permission and show alert
    if (!entity.can(FLAG_REMIND, true)) {
      return;
    }
    serviceProvider.navigation.navigate('Compose', {
      isRemind: true,
      entity,
    });
  };

  /**
   * Remind
   */
  const remind = () => {
    const compose = createComposeStore({ props: {}, newsfeed: null });
    compose.setRemindEntity(entity);
    compose.submit().then(activity => {
      // append the entity to the feed
      ActivityModel.events.emit('newPost', activity);
      analytics.trackClick('remind');
      serviceProvider.resolve('storeRating').track('remind', true);
      entity.setHasReminded(true);

      showNotification(i18n.t('postReminded'), 'success');
    });
  };

  const undo = () => {
    entity
      .deleteRemind()
      .then(() => {
        entity.setHasReminded(false);
        showNotification(i18n.t('remindRemoved'), 'success');
      })
      .catch(error => {
        const message = getNetworkError(error);
        showNotification(message || i18n.t('errorMessage'), 'warning');
      });
  };

  const shareToGroup = () => {
    pushAudienceSelector({
      title: i18n.t('shareToGroup'),
      mode: 'groups',
      onSelect: (audience: ComposeAudience) => {
        const nav = serviceProvider.navigation;
        nav.goBack();
        nav.navigate('Compose', {
          audience,
          isRemind: true,
          entity,
        });
      },
    });
  };
  const permissions = serviceProvider.permissions;
  const shouldHideInteract = permissions.shouldHideInteract();
  const shouldHideCreatePost = permissions.shouldHideCreatePost();

  const reminded = await entity.hasReminded();

  return pushBottomSheet({
    safe: true,
    component: ref => (
      <>
        <>
          {!shouldHideInteract ? (
            reminded ? (
              <BottomSheetMenuItem
                onPress={async () => {
                  await ref.close();
                  if (permissions.canInteract(true)) {
                    undo();
                  }
                }}
                title={i18n.t('undoRemind')}
                iconName="undo"
                iconType="material"
              />
            ) : (
              <BottomSheetMenuItem
                onPress={async () => {
                  await ref.close();
                  if (permissions.canInteract(true)) {
                    remind();
                  }
                }}
                title={i18n.t('capture.remind')}
                iconName="repeat"
                iconType="material"
              />
            )
          ) : null}
          {!shouldHideCreatePost && (
            <BottomSheetMenuItem
              onPress={async () => {
                await ref.close();
                if (permissions.canCreatePost(true)) {
                  quote();
                }
              }}
              title={i18n.t('quote')}
              iconName="edit"
              iconType="material"
            />
          )}

          {!shouldHideCreatePost && (
            <BottomSheetMenuItem
              onPress={async () => {
                await ref.close();
                if (permissions.canCreatePost(true)) {
                  shareToGroup();
                }
              }}
              title={i18n.t('groupShare')}
              iconName="account-multiple"
              iconType="material-community"
            />
          )}
        </>

        <BottomSheetButton text={i18n.t('cancel')} onPress={ref.close} />
      </>
    ),
  });
};
