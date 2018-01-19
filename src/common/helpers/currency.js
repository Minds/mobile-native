import number from './number';

export default function currency(value, currency, affix = true) {
  let output;

  switch (currency) {
    case 'usd':
    case 'money':
      output = number(value, 2, 2);

      if (affix === 'prefix') {
        return `$ ${output}`;
      } else if (affix === 'suffix') {
        return `${output} USD`;
      }

      return affix === true ? `$ ${output} USD` : output;

    case 'tokens':
      output = number(value, 0, 4);
      return affix === true || affix === 'suffix' ? `${output} tokens` : output;

    case 'rewards':
      output = number(value, 0, 4);
      return affix === true || affix === 'suffix' ? `${output} rewards` : output;

    default:
      return `${number(value)}`;
  }
};
