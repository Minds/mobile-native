export default function addressExcerpt(address) {
  if (!address || address.toLowerCase().indexOf('0x') !== 0) {
    return address;
  }

  return `0×${address.substr(2, 5)}...${address.substr(-5)}`;
}
