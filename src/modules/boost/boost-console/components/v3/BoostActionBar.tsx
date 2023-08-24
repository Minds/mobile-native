import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { showNotification } from '~/../AppMessages';
import type UserStore from '~/auth/UserStore';
import { confirm } from '~/common/components/Confirm';
import { B1, Button, Column, Row } from '~/common/ui';
import { format } from '~/wallet/v3/currency-tabs/MindsTokens';
import { useTranslation } from '../../../locales';
import type BoostModel from '../../../models/BoostModelV3';
import { BoostPaymentMethod, BoostStatus } from '../../types/BoostConsoleBoost';

type BoostActionBarProps = {
  boost: BoostModel;
  user?: UserStore;
};

function BoostActionBar({ boost }: BoostActionBarProps) {
  const { t } = useTranslation();
  const {
    created_timestamp,
    boost_status,
    payment_amount,
    payment_method,
    summary,
  } = boost ?? {};
  const date = moment(created_timestamp * 1000).format('M/D/YY h:mma');

  const impressions = summary?.views_delivered ?? 0;
  const cpm = format(
    impressions > 0 ? (1000 * payment_amount) / impressions : 0,
  );
  const cpmLabel = t(
    payment_method === BoostPaymentMethod.cash ? '${{cpm}}' : '{{cpm}} tokens',
    { cpm },
  );

  const revokable = boost_status === BoostStatus.PENDING;
  const showStats =
    boost_status === BoostStatus.APPROVED ||
    boost_status === BoostStatus.COMPLETED;

  const revoke = async () => {
    if (
      await confirm({
        title: t('Revoke boost'),
        description: t('Are you sure you want to revoke this boost?'),
      })
    ) {
      boost.revoke().catch(() => {
        showNotification(
          t('Something went wrong while revoking boost'),
          'danger',
        );
      });
    }
  };

  return (
    <Column horizontal="L" bottom="L">
      {showStats && (
        <>
          <Row flex>
            <Column flex>
              <B1 font="bold">{t('Results')}</B1>
            </Column>
            <Column flex>
              <B1 font="bold">{t('CPM')}</B1>
            </Column>
            <Column flex>
              <B1 font="bold">{t('Start date')}</B1>
            </Column>
          </Row>
          <Row flex bottom="L">
            <Column flex>
              <B1 color="secondary">
                {boost.summary?.views_delivered ?? ''} {t('views')}
              </B1>
            </Column>
            <Column flex>
              <B1 color="secondary">{cpmLabel}</B1>
            </Column>
            <Column flex>
              <B1 color="secondary">{date}</B1>
            </Column>
          </Row>
          <Row flex>
            <Column flex>
              {Boolean(boost.summary?.total_clicks) && (
                <B1 font="bold">{t('Link clicks')}</B1>
              )}
            </Column>
            <Column flex />
            <Column flex />
          </Row>
          {Boolean(boost.summary?.total_clicks) && (
            <Row flex bottom="L">
              <Column flex>
                <B1 color="secondary">{boost.summary?.total_clicks}</B1>
              </Column>
              <Column flex />
              <Column flex />
            </Row>
          )}
        </>
      )}
      {!!revokable && (
        <Button bottom="S" onPress={revoke}>
          <B1>{t('Revoke')}</B1>
        </Button>
      )}
    </Column>
  );
}

export default observer(BoostActionBar);
