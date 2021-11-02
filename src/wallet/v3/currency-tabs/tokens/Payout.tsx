import React from 'react';
import { IconButton } from '~ui/icons';
import i18n from '../../../../common/services/i18n.service';
import MindsTokens from '../MindsTokens';
import { TokensTabStore } from './createTokensTabStore';
import { B1, Row, HairlineRow } from '~ui';

type PropsType = {
  minds: string;
  mindsPrice: string;
  isToday: boolean;
  store: TokensTabStore;
};

const Payout = ({ minds, mindsPrice, isToday, store }: PropsType) => {
  return (
    <HairlineRow>
      <Row flex space="L">
        <Row flex>
          <B1 font="medium">
            {isToday
              ? i18n.t('wallet.todayEstimate')
              : i18n.t('wallet.usd.earnings')}
          </B1>
        </Row>
        <Row align="centerEnd" horizontal="M">
          <MindsTokens value={minds} mindsPrice={mindsPrice} />
        </Row>
        <IconButton
          onPress={() => store.loadRewards(store.rewardsSelectedDate)}
          name="refresh"
          size="small"
        />
      </Row>
    </HairlineRow>
  );
};

export default Payout;
