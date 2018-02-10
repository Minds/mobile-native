import CreditCardType from 'credit-card-type';

export default function creditCardType(number, single = true) {
  if (!number) {
    return null;
  }

  const cards = CreditCardType(number);

  if (!cards || typeof cards[0] === 'undefined' || (single && cards.length > 1)) {
    return null;
  }

  if (single) {
    return cards[0];
  }

  return cards;
}
