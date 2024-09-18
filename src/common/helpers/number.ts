const THOUSAND_SEP = ',';
const DECIMAL_SEP = '.';

export default function number(
  rawValue,
  minDecimals = 0,
  maxDecimals = minDecimals,
) {
  let value;

  if (
    typeof rawValue === 'string' &&
    !isNaN(+rawValue - parseFloat(rawValue))
  ) {
    value = +rawValue;
  } else if (typeof rawValue !== 'number') {
    throw new Error(`${rawValue} is not a number`);
  } else {
    value = rawValue;
  }

  if (!isFinite(value)) {
    return value;
  }

  value = value.toFixed(maxDecimals);

  const integerValue = Math.floor(value),
    decimalsValue = (value - integerValue).toFixed(maxDecimals);

  let formattedIntegerValue = `${integerValue}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    THOUSAND_SEP,
  );

  if (maxDecimals > 0 && decimalsValue.length > 1) {
    let formattedDecimalsValue = decimalsValue.substr(2);

    for (let i = maxDecimals - 1; i >= minDecimals; i--) {
      if (formattedDecimalsValue.charAt(i) === '0') {
        formattedDecimalsValue = formattedDecimalsValue.substr(
          0,
          formattedDecimalsValue.length - 1,
        );
      } else {
        break;
      }
    }

    if (!formattedDecimalsValue) {
      return `${formattedIntegerValue}`;
    }

    return `${formattedIntegerValue}${DECIMAL_SEP}${formattedDecimalsValue}`;
  }

  return `${formattedIntegerValue}`;
}
