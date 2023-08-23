import React, { useCallback } from 'react';
import { IconButtonNext } from '~ui/icons';
import { FLAG_REMIND } from '../../../common/Permissions';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type BlogModel from '../../../blogs/BlogModel';
import i18n from '../../../common/services/i18n.service';
import createComposeStore, {
  ComposeAudience,
} from '../../../compose/createComposeStore';
import { pushAudienceSelector } from '../../../compose/ComposeAudienceSelector';
import { showNotification } from '../../../../AppMessages';
import sessionService from '../../../common/services/session.service';
import { actionsContainerStyle } from './styles';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import {
  BottomSheetButton,
  BottomSheetMenuItem,
  pushBottomSheet,
} from '../../../common/components/bottom-sheet';
import EntityCounter from './EntityCounter';
import { storeRatingService } from 'modules/store-rating';
import { useAnalytics } from '~/common/contexts/analytics.context';
import NavigationService from '../../../navigation/NavigationService';
import type NewsfeedStore from '../../NewsfeedStore';

type PropsTypes = {
  entity: ActivityModel | BlogModel;
  size?: number;
  hideCount?: boolean;
  vertical?: boolean;
};

/**
 * Remind Action Component
 */
export default function ({ entity, hideCount }: PropsTypes) {
  const reminded =
    entity.remind_users &&
    entity.remind_users.some(
      user => user.guid === sessionService.getUser().guid,
    );

  const disabled = !reminded && !entity.can(FLAG_REMIND);

  const { newsfeed } = useLegacyStores();
  const analytics = useAnalytics();

  const showDropdown = useCallback(() => {
    pushRemindActionSheet({
      reminded,
      entity,
      newsfeed,
      analytics,
    });
  }, [reminded, entity]);

  return (
    <IconButtonNext
      testID="Remind activity button"
      style={actionsContainerStyle}
      scale
      disabled={disabled}
      name="remind"
      size="small"
      fill
      active={reminded}
      onPress={showDropdown}
      extra={
        !hideCount && entity.reminds ? (
          <EntityCounter entity={entity} countProperty="reminds" />
        ) : null
      }
    />
  );
}

const pushRemindActionSheet = ({
  reminded,
  entity,
  newsfeed,
  analytics,
}: {
  reminded?: boolean;
  entity: ActivityModel;
  newsfeed: NewsfeedStore;
  analytics;
}) => {
  /**
   * Open quote in composer
   */
  const quote = () => {
    // check permission and show alert
    if (!entity.can(FLAG_REMIND, true)) {
      return;
    }

    NavigationService.navigate('Compose', {
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
    compose
      .submit()
      .then(activity => {
        // append the entity to the feed
        newsfeed.feedStore.prepend(activity);
        analytics.trackClick('remind');
        storeRatingService.track('remind', true);

        showNotification(i18n.t('postReminded'), 'success');
      })
      .catch(e => {
        console.log(e);
        showNotification(i18n.t('errorMessage'), 'warning');
      });
  };

  const undo = () => {
    entity
      .deleteRemind()
      .then(() => {
        showNotification(i18n.t('remindRemoved'), 'success');
      })
      .catch(e => {
        console.log(e);
        showNotification(i18n.t('errorMessage'), 'warning');
      });
  };

  const shareToGroup = () => {
    pushAudienceSelector({
      title: i18n.t('shareToGroup'),
      mode: 'groups',
      onSelect: (audience: ComposeAudience) => {
        NavigationService.goBack();
        NavigationService.navigate('Compose', {
          audience,
          isRemind: true,
          entity,
        });
      },
    });
  };

  return pushBottomSheet({
    safe: true,
    component: ref => (
      <>
        {reminded ? (
          <BottomSheetMenuItem
            onPress={async () => {
              await ref.close();
              undo();
            }}
            title={i18n.t('undoRemind')}
            iconName="undo"
            iconType="material"
          />
        ) : (
          <>
            <BottomSheetMenuItem
              onPress={async () => {
                await ref.close();
                remind();
              }}
              title={i18n.t('capture.remind')}
              iconName="repeat"
              iconType="material"
            />
            <BottomSheetMenuItem
              onPress={async () => {
                await ref.close();
                quote();
              }}
              title={i18n.t('quote')}
              iconName="edit"
              iconType="material"
            />
            <BottomSheetMenuItem
              onPress={async () => {
                await ref.close();
                shareToGroup();
              }}
              title={i18n.t('groupShare')}
              iconName="account-multiple"
              iconType="material-community"
            />
          </>
        )}
        <BottomSheetButton text={i18n.t('cancel')} onPress={ref.close} />
      </>
    ),
  });
};
