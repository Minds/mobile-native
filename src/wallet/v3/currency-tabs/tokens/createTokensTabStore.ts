import moment from 'moment';
import {
  ContributionMetric,
  WalletStoreType,
} from '../../../v2/createWalletStore';
import { TokensOptions } from '../../../v2/WalletTypes';

export type Reward = {
  user_guid: string;
  date: string;
  date_iso8601: string;
  date_unixts: number;
  reward_type: 'engagement' | 'holding' | 'liquidity';
  score: string;
  share_pct: number;
  multiplier: number;
  token_amount: string;
  tokenomics_version: number;
  alltime_summary: {
    score: string;
    token_amount: string;
  };
  global_summary: {
    score: string;
    token_amount: string;
  };
};

type RewardsType = {
  date: string;
  date_iso8601: string;
  date_unixts: number;
  engagement: Reward;
  holding: Reward;
  liquidity: Reward;
  total: { daily: string; alltime: string };
  user_guid: string;
  eth: string;
  minds: string;
};

export const createTokensTabStore = (walletStore: WalletStoreType) => ({
  option: walletStore.initialTab || ('rewards' as TokensOptions),
  setOption(option: TokensOptions) {
    this.option = option;
  },
  rewardsSelectedDate: new Date(),
  rewards: {} as RewardsType,
  contributionScores: [] as ContributionMetric[],
  liquidityPositions: {} as any,
  loading: false,
  get isToday() {
    return (
      this.rewardsSelectedDate.toDateString() === new Date().toDateString()
    );
  },
  setLoading(loading) {
    this.loading = loading;
  },
  onConfirm(date: Date) {
    console.log('onConfirm', date);
    if (
      Math.abs(date.getTime() - this.rewardsSelectedDate.getTime()) > 300000
    ) {
      this.rewardsSelectedDate = date;
    }
  },
  setRewards(
    response:
      | false
      | {
          rewards: RewardsType;
          contributionScores: ContributionMetric[];
        },
  ) {
    if (response) {
      this.rewards = response.rewards;
      this.contributionScores = response.contributionScores;
    }
  },
  async loadRewards(date: Date) {
    this.setLoading(true);
    const response = await walletStore.loadRewards(date);
    this.setRewards(response);
    this.setLoading(false);
  },
  setLiquidityPositions(liquidityPositions) {
    this.liquidityPositions = liquidityPositions;
  },
  async loadLiquidityPositions() {
    const liquidityPositions = await walletStore.loadLiquiditySummary(
      this.rewardsSelectedDate,
    );
    this.setLiquidityPositions(liquidityPositions);
  },
  earningsSelectedDate: new Date(),
  monthPickerOnConfirm(date: Date) {
    this.earningsSelectedDate = date;
  },
  async loadEarnings(date: Date) {
    this.setLoading(true);
    const from = moment(date).utc().startOf('month').unix();
    await walletStore.loadEarnings(
      from,
      moment.unix(from).utc().add(1, 'month').unix(),
    );
    this.setLoading(false);
  },
});

export type TokensTabStore = ReturnType<typeof createTokensTabStore>;
