import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import SupermindLabel from '~/common/components/supermind/SupermindLabel';
import i18n from '~/common/services/i18n.service';
import { B2, Button, Column, Row, Spacer } from '~/common/ui';
import Activity from '~/newsfeed/activity/Activity';
import { hasVariation } from '../../ExperimentsProvider';
import { borderBottomStyle } from './AddBankInformation';
import SupermindRequestModel from './SupermindRequestModel';
import { ensureTwitterConnected } from './SupermindTwitterConnectScreen';
import { SupermindRequestReplyType, SupermindRequestStatus } from './types';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { observer } from 'mobx-react';
import apiService from '~/common/services/api.service';
import { confirm } from '~/common/components/Confirm';
import { TWITTER_ENABLED } from '~/config/Config';

type Props = {
  request: SupermindRequestModel;
  outbound?: boolean;
};

function SupermindRequest({ request, outbound }: Props) {
  const navigation = useNavigation();
  const isTwitterEnabled =
    request.twitter_required &&
    hasVariation('engine-2503-twitter-feats') &&
    TWITTER_ENABLED;

  const answer = React.useCallback(async () => {
    if (isTwitterEnabled && hasVariation('mob-twitter-oauth-4715')) {
      const connected = await ensureTwitterConnected(navigation);

      if (!connected) {
        return;
      }
    }

    if (request.reply_type === SupermindRequestReplyType.LIVE) {
      if (
        await confirm({
          title: i18n.t('supermind.liveReplyConfirm.title'),
          description: i18n.t('supermind.liveReplyConfirm.description'),
        })
      ) {
        apiService.post(`api/v3/supermind/${request.guid}/accept-live`);
        request.setStatus(SupermindRequestStatus.ACCEPTED);

        // refresh in-feed notices
        inFeedNoticesService.load();
      }
    } else {
      navigation.navigate('Compose', {
        isRemind: true,
        supermindObject: request,
        allowedMode: composerModes[request.reply_type],
        entity: request.entity,
        onSave: entity => {
          //  update request status
          request.setStatus(SupermindRequestStatus.ACCEPTED);
          request.setReplyGuid(entity.guid);

          // refresh in-feed notices
          inFeedNoticesService.load();
        },
      });
    }
  }, [isTwitterEnabled, navigation, request]);

  return (
    <Spacer top="XL">
      <View style={borderBottomStyle}>
        <Row space="L" align="baseline">
          <SupermindLabel text={` ${request.formattedAmount} offer `} />
          <Status request={request} />
        </Row>
      </View>
      {request.entity ? (
        <Activity
          entity={request.entity}
          navigation={navigation}
          hideMetrics
          hideTabs
          borderless
        />
      ) : (
        <B2 color="secondary" left="L" vertical="L">
          {i18n.t('supermind.postUnavailable')}
        </B2>
      )}

      <B2 color={request.receiver_entity ? 'primary' : 'secondary'} left="L">
        {request.receiver_entity
          ? i18n.t('supermind.to', { name: request.receiver_entity.username }) +
            ' · '
          : i18n.t('requirements') + ': '}
        <B2>{i18n.t(`supermind.replyType.${request.reply_type}`)}</B2>
        {isTwitterEnabled && (
          <>
            {' · '}
            <B2>Twitter</B2>
          </>
        )}
      </B2>
      <Column space="L" top="XXL">
        {!outbound &&
          request.status === SupermindRequestStatus.CREATED &&
          !request.isExpired() && (
            <>
              <Button
                testID="acceptButton"
                mode="outline"
                type="action"
                bottom="L"
                onPress={answer}
                spinner
                disabled={request.isLoading > 0}>
                {i18n.t('supermind.acceptOffer')}
              </Button>
              <Button
                testID="rejectButton"
                mode="outline"
                type="base"
                disabled={request.isLoading > 0}
                onPress={() => request.reject()}>
                {i18n.t('supermind.decline')}
              </Button>
            </>
          )}
        <SuperMindViewButton request={request} />
      </Column>
    </Spacer>
  );
}

// Composer mode based on request_type
const composerModes = [null, 'photo', 'video'];

export default observer(SupermindRequest);

/**
 * Status label
 */
const Status = ({ request }: { request: SupermindRequestModel }) => {
  let body: React.ReactNode = null;
  switch (request.status) {
    case SupermindRequestStatus.CREATED:
      body = !request.isExpired() ? (
        <>
          {i18n.t('expires')}: <B2>{request.formattedExpiration}</B2>
        </>
      ) : (
        i18n.t('supermind.status.expired')
      );
      break;
    case SupermindRequestStatus.ACCEPTED:
      body = i18n.t('supermind.status.accepted');
      break;

    case SupermindRequestStatus.REVOKED:
      body = i18n.t('supermind.status.revoked');
      break;

    case SupermindRequestStatus.REJECTED:
      body = i18n.t('supermind.status.rejected');
      break;

    case SupermindRequestStatus.FAILED_PAYMENT:
      body = i18n.t('supermind.status.paymentFailed');
      break;

    case SupermindRequestStatus.FAILED:
      body = i18n.t('supermind.status.failed');
      break;
  }

  return (
    <B2 color="secondary" left="L">
      {body}
    </B2>
  );
};

/**
 * Supermind view reply button
 */
const SuperMindViewButton = ({
  request,
}: {
  request: SupermindRequestModel;
}) => {
  return request.status === SupermindRequestStatus.ACCEPTED &&
    Boolean(request.reply_activity_guid) ? (
    <Button
      testID="viewButton"
      mode="outline"
      type="base"
      disabled={request.isLoading > 0}
      onPress={() => request.viewReply()}>
      {i18n.t('supermind.viewReply')}
    </Button>
  ) : null;
};
