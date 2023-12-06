import { useMemo } from 'react';
import {
  Enum_Upgradepage_Cardid,
  Enum_Upgradepage_Rowtype,
  useUpgradePageQuery,
} from '~/graphql/strapi';
import { UpgradeCardsMap, UpgradePageRowEntity } from '../types';
import mindsConfigService from '~/common/services/minds-config.service';

export function useUpgradeData() {
  const { isLoading, data, error } = useUpgradePageQuery();

  const options: UpgradeCardsMap = useMemo(() => {
    return data?.upgradePages?.data ? parseData(data.upgradePages.data) : {};
  }, [data]);

  return {
    options,
    isLoading,
    error,
  };
}

function parseData(data) {
  const upgradeCards: UpgradeCardsMap = {};

  const prices = getConfigPrices();

  // Loop through the all the rows and group it into card objects
  data.forEach((item: UpgradePageRowEntity) => {
    const { cardId, rowType, displayText, iconId, iconSource } =
      item.attributes;

    // Create the card if it doesn't exist
    if (!upgradeCards[cardId]) {
      upgradeCards[cardId] = {
        titleIconId: null,
        cardId,
        bullets: [],
      };
    }
    switch (rowType) {
      case Enum_Upgradepage_Rowtype.Price:
        upgradeCards[cardId].priceTextArray = getPriceTextArray(displayText);
        upgradeCards[cardId].price = displayText;
        // update price from config
        if (prices[cardId] && upgradeCards[cardId].priceTextArray) {
          upgradeCards[cardId].priceTextArray![1] = prices[cardId].toString();
        }
        break;
      case Enum_Upgradepage_Rowtype.Title:
        upgradeCards[cardId].title = displayText;
        upgradeCards[cardId].titleIconId = iconId || null;
        break;
      case Enum_Upgradepage_Rowtype.Bullet:
        upgradeCards[cardId].bullets.push({
          displayText,
          iconId,
          iconSource,
        });
        break;
      case Enum_Upgradepage_Rowtype.LinkText:
        upgradeCards[cardId].linkText = displayText;
        break;
    }
  });

  return upgradeCards;
}

/**
 * Separate the price string into an array.
 * The price part of the string (e.g. {{$5}}) will be displayed in bold
 * @param displayText - the "price" row for this card
 * @returns textArray string[]
 */
function getPriceTextArray(displayText: string): string[] {
  const matches = displayText.match(/(.*?)\{\{(.*?)\}\}(.*)/);

  if (!matches || matches.length === 3 || matches.length > 4) {
    return [displayText];
  }

  // Strip the dollar sign from the price for now
  let priceTextArray = [matches[1], matches[2].replace(/\$/g, '')];

  if (matches[3]) {
    priceTextArray.push(matches[3]);
  }

  return priceTextArray;
}

/**
 * Get prices from database.
 */
function getConfigPrices(): Record<Enum_Upgradepage_Cardid, number> {
  // Get the yearly prices and divide by 12 to ensure we grab the lowest  price per month
  const config = mindsConfigService.getSettings().upgrades;

  if (!config) {
    return {
      [Enum_Upgradepage_Cardid.Plus]: 0,
      [Enum_Upgradepage_Cardid.Networks]: 0,
      [Enum_Upgradepage_Cardid.Pro]: 0,
      [Enum_Upgradepage_Cardid.Hero]: 0,
    };
  }

  const plusPrice = config.plus.yearly.usd / 12;
  const proPrice = config.pro.yearly.usd / 12;
  const networkPrice = config.networks_team.yearly.usd / 12;

  return {
    [Enum_Upgradepage_Cardid.Plus]: plusPrice,
    [Enum_Upgradepage_Cardid.Pro]: proPrice,
    [Enum_Upgradepage_Cardid.Networks]: networkPrice,

    [Enum_Upgradepage_Cardid.Hero]: Math.min(plusPrice, proPrice, networkPrice),
  };
}
