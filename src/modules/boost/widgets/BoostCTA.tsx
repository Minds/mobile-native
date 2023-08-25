import { observer } from 'mobx-react';
import { useCallback, useEffect, useState } from 'react';
import Subscribe from '~/channel/v2/buttons/Subscribe';
import { useAnalytics } from '~/common/contexts/analytics.context';
import openUrlService from '~/common/services/open-url.service';
import { Button, Spacer } from '~/common/ui';
import ActivityModel from '~/newsfeed/ActivityModel';
import { useTranslation } from '../locales';

interface BoostCTAProps {
  entity: ActivityModel;
}

const BoostCTA = ({ entity }: BoostCTAProps) => {
  const { t } = useTranslation();
  const {
    goal_button_text: text,
    goal_button_url: url,
    ownerObj: channel,
  } = entity;
  const analytics = useAnalytics();
  const [clicked, setClicked] = useState(false);

  const trackClick = useCallback(() => {
    if (clicked) {
      return;
    }

    // @ts-ignore
    analytics.trackClick(entity.guid);
    setClicked(true);
  }, [analytics, entity.guid, clicked]);

  const navigateToUrl = useCallback(() => {
    trackClick();
    openUrlService.open(url!);
  }, [trackClick, url]);

  useEffect(() => {
    setClicked(false);
  }, [entity]);

  if (!text || (channel?.subscribed && !clicked && !url)) {
    return null;
  }

  return (
    <Spacer horizontal="L" top="S" bottom="M">
      {url ? (
        <Button
          mode="outline"
          type="action"
          stretch
          size="tiny"
          onPress={navigateToUrl}>
          {t(`goalText.${text}`)}
        </Button>
      ) : (
        <Subscribe
          text={
            !channel.isOwner() && channel.isSubscribed()
              ? t('Subscribed')
              : t(`goalText.${text}`)
          }
          disabled={clicked || channel.isOwner()}
          channel={channel}
          shouldUpdateFeed={false}
          onSubscribed={trackClick}
        />
      )}
    </Spacer>
  );
};

export default observer(BoostCTA);
