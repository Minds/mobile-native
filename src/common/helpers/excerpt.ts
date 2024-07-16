export default function excerpt(str, max) {
  if (!str || str.length <= max) {
    return str;
  }

  return str.substr(0, max - 3) + '...';
}
