import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type UserStore from '~/auth/UserStore';
import MText from '~/common/components/MText';
import i18n from '~/common/services/i18n.service';
import { B1, Button, Column, Row } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { showNotification } from '../../../../../../AppMessages';
import { confirm } from '../../../../../common/components/Confirm';
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

  function renderTime() {
    const date = i18n.date(boost.created_timestamp * 1000, 'friendly');
    return (
      <View style={ThemedStyles.style.flexColumnCentered} key="time">
        <MCIcon name="clock" size={20} style={styles.icon} />
        <MText style={styles.value} numberOfLines={1}>
          {date}
        </MText>
      </View>
    );
  }

  function renderActions() {
    let buttons: ReactElement[] = [];

    if (revokable) {
      buttons.push(
        <Button
          bottom="S"
          onPress={async () => {
            if (
              await confirm({
                title: 'Revoke boost',
                description: 'Are you sure you want to revoke this boost?',
              })
            ) {
              boost.revoke(boostConsoleStore.filter).catch(() => {
                showNotification(
                  'Something went wrong while revoking boost',
                  'danger',
                );
              });
            }
          }}>
          <B1>{i18n.t('revoke')}</B1>
        </Button>,
      );
    }

    return buttons;
  }

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
          <B1 color="secondary">{renderTime()}</B1>
        </Column>
      </Row>
      {renderActions()}
    </Column>
  );
}

export default observer(BoostActionBar);

const styles = ThemedStyles.create({
  container: [
    'bcolorBaseBackground',
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      padding: 4,
      paddingBottom: 16,
    },
  ],
  icon: ['marginBottom', 'colorSecondaryText'],
  value: {
    fontSize: 11,
    marginTop: 4,
  },
});
