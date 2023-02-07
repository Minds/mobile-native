import React from 'react';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import i18n from '~/common/services/i18n.service';
import Activity from '~/newsfeed/activity/Activity';
import { borderBottomStyle } from './AddBankInformation';
import SupermindRequestModel from './SupermindRequestModel';
import { B2, Button, Column, Row, Spacer } from '~/common/ui';
import SupermindLabel from '~/common/components/supermind/SupermindLabel';
import { SupermindRequestStatus } from './types';

type Props = {
  request: SupermindRequestModel;
  outbound?: boolean;
};

export default function SupermindRequest({ request, outbound }: Props) {
  const navigation = useNavigation();

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
        {request.twitter_required && (
          <>
            {' · '}
            <B2>Twitter</B2>
          </>
        )}
      </B2>
      {outbound ? (
        <OutboundButtons request={request} />
      ) : (
        <InboundButtons request={request} />
      )}
    </Spacer>
  );
}

// Composer mode based on request_type
const composerModes = [null, 'photo', 'video'];

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
 * Inbound buttons
 */
const InboundButtons = observer(
  ({ request }: { request: SupermindRequestModel }) => {
    const navigation = useNavigation();

    const answer = React.useCallback(() => {
      navigation.navigate('Compose', {
        isRemind: true,
        supermindObject: request,
        allowedMode: composerModes[request.reply_type],
        entity: request.entity,
        onSave: entity => {
          request.setStatus(SupermindRequestStatus.ACCEPTED);
          request.setReplyGuid(entity.guid);
        },
      });
    }, [navigation, request]);

    return (
      <Column space="L" top="XXL">
        {request.status === SupermindRequestStatus.CREATED &&
          !request.isExpired() && (
            <>
              <Button
                testID="acceptButton"
                mode="outline"
                type="action"
                bottom="L"
                onPress={answer}
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
    );
  },
);

/**
 * Outbound buttons
 */
const OutboundButtons = observer(
  ({ request }: { request: SupermindRequestModel }) => {
    return (
      <Column space="L" top="XXL">
        {/* {request.status === SupermindRequestStatus.CREATED && (
          <Button
            mode="outline"
            type="base"
            disabled={request.isLoading > 0}
            onPress={() => request.revoke()}>
            {i18n.t('supermind.cancelOffer')}
          </Button>
        )} */}
        <SuperMindViewButton request={request} />
      </Column>
    );
  },
);

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
