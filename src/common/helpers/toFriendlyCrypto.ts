import Big from 'big.js';
// **
// Converts really long crypto values into friendly numbers
// Notes:
// Assumes input currency has 18 decimal places
// Decimals are *not* rounded up
// Trailing zeros are cut off (e.g. no decimals will be returned if decimal value is 0)
// **

export default function toFriendlyCrypto(
  longCryptoVal: number | string,
  decimalCount?: number, // how many decimals you want to be returned
) {
  decimalCount = decimalCount || 3;
  decimalCount = decimalCount > 17 ? 17 : decimalCount;
  decimalCount = decimalCount < 0 ? 0 : decimalCount;

  // Assuming longCryptoVal is a string
  const longVal = new Big(longCryptoVal.toString());

  // Calculate friendlyCryptoVal
  const power = new Big(10).pow(18 - decimalCount);
  const friendlyCryptoVal =
    longVal.div(power).toNumber() / Math.pow(10, decimalCount);

  return friendlyCryptoVal;
}
