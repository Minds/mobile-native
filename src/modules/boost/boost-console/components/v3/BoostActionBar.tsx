import { observer } from 'mobx-react';
import React from 'react';
import { showNotification } from '~/../AppMessages';
import type UserStore from '~/auth/UserStore';
import { confirm } from '~/common/components/Confirm';
import i18n from '~/common/services/i18n.service';
import { B1, Button, Column, Row } from '~/common/ui';
import { useTranslation } from '../../../locales';
import type BoostModel from '../../../models/BoostModelV3';
import { useBoostConsoleStore } from '../../contexts/boost-store.context';
import { BoostStatus } from '../../types/BoostConsoleBoost';

type BoostActionBarProps = {
  boost: BoostModel;
  user?: UserStore;
};

function BoostActionBar({ boost }: BoostActionBarProps) {
  const boostConsoleStore = useBoostConsoleStore();
  const { t } = useTranslation();
  const revokable = boost.boost_status === BoostStatus.PENDING;
  const date = i18n.date(boost.created_timestamp * 1000, 'friendly');

  return (
    <Column horizontal="L" bottom="L">
      <Row flex>
        <Column flex>
          <B1 font="bold" right="M">
            {t('Estimated reach')}
          </B1>
        </Column>
        <Column flex>
          <B1 font="bold">{t('Results')}</B1>
        </Column>
        <Column flex>
          <B1 font="bold">{t('Start date')}</B1>
        </Column>
      </Row>
      <Row flex bottom="L">
        <Column flex>
          <B1 />
        </Column>
        <Column flex>
          <B1 color="secondary">{boost.entity?.impressions ?? ''}</B1>
        </Column>
        <Column flex>
          <B1 color="secondary">{date}</B1>
        </Column>
      </Row>
      {!!revokable && (
        <Button
          bottom="S"
          onPress={async () => {
            if (
              await confirm({
                title: t('Revoke boost'),
                description: t('Are you sure you want to revoke this boost?'),
              })
            ) {
              boost.revoke(boostConsoleStore.filter).catch(() => {
                showNotification(
                  t('Something went wrong while revoking boost'),
                  'danger',
                );
              });
            }
          }}>
          <B1>{t('Revoke')}</B1>
        </Button>
      )}
    </Column>
  );
}

export default observer(BoostActionBar);
