//@ts-nocheck
export default function token(number, decimals=18){
  decimals = Math.pow(10, decimals);
  return number / decimals;
}