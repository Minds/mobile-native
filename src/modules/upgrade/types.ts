import { UpgradePage } from '~/graphql/strapi';

export type UpgradePageCard = UpgradePageRow[];
export type UpgradePageRow = UpgradePage & {
  priceTextArray: string[] | null;
};
export type UpgradePageRowEntity = {
  attributes: UpgradePageRow;
};

export type UpgradeCardsMap = {
  [key: string]: {
    cardId: string;
    titleIconId: string | null;
    priceTextArray?: string[];
    price?: string;
    title?: string;
    bullets: Bullets;
    linkText?: string;
  };
};

export type Bullets = Array<{
  displayText: string;
  iconId?: string | null;
  iconSource?: string | null;
}>;

export type UpgradePageToggleValue = 'upgrade' | 'gift';
export type UpgradePageConfigPrices =
  | {
      hero: number;
      plus: number;
      pro: number;
      networks?: number;
    }
  | {};
