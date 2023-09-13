import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import apiService from '~/common/services/api.service';
import { BoostCashCard, CardColor } from './BoostCashCard';
import { useState } from 'react';

type Product = {
  cardColor: CardColor;
  duration: number;
  amount: number;
};
const products: Record<CardColor, Product> = {
  gray: {
    cardColor: 'gray',
    duration: 1,
    amount: 1,
  },
  blue: {
    cardColor: 'blue',
    duration: 1,
    amount: 10,
  },
  purple: {
    cardColor: 'purple',
    duration: 30,
    amount: 1,
  },
  yellow: {
    cardColor: 'yellow',
    duration: 30,
    amount: 10,
  },
};
type BoostCashCardsProps = {
  audience: string;
  onSelectCard: (card: Product) => void;
};
export const BoostCashCards = ({
  audience,
  onSelectCard,
}: BoostCashCardsProps) => {
  const insights = useCachedBoostInsights(audience);
  const { t } = useTranslation();
  const [selected, setSelected] = useState<CardColor>('gray');

  const onSelect = (card: CardColor) => () => {
    setSelected(card);
    onSelectCard(products[card]);
  };

  return (
    <>
      {Object.values(products).map(product => {
        const interval = insights?.[product.cardColor];
        return (
          <BoostCashCard
            key={product.cardColor}
            {...product}
            selected={selected === product.cardColor}
            onSelect={onSelect(product.cardColor)}
            estimated={
              interval
                ? `${interval.low?.toLocaleString()} - ${interval.high?.toLocaleString()}`
                : t('Unknown')
            }
          />
        );
      })}
    </>
  );
};

type HighLow = { low: number; high: number };
type Data = { views: HighLow; cpm: HighLow };

const useCachedBoostInsights = (audience: string) => {
  const productQueries = useQueries({
    queries: Object.values(products).map(({ cardColor, duration, amount }) => ({
      queryKey: [cardColor, duration, amount],
      queryFn: async () => ({
        id: cardColor,
        ...(await apiService.get<Data>('api/v3/boosts/insights/estimate', {
          daily_bid: amount,
          duration,
          audience: audience === 'safe' ? 1 : 2,
          payment_method: 1, // cash
        })),
      }),
    })),
  });

  const response = {} as Record<CardColor, HighLow>;
  productQueries.map(query => {
    if (query.data?.id) {
      response[query.data.id] = query.data?.views;
    }
  });

  return response;
};
