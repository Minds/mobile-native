const multiplier = 1;

function getBorder(name) {
  if (!name) {
    return multiplier;
  }
  const regex = /(\d?\d)x/g;
  const result = regex.exec(name);

  if (result) {
    const n = parseInt(result[1], 10);
    if (n === 0 || n > 0) {
      return n * multiplier;
    }
  }
}

export default function borders(name: string) {
  const regex = /^border(Top|Bottom|Left|Right|Radius)?(.*)/g;
  const result = regex.exec(name);

  if (result) {
    const size = getBorder(result[2]);
    return size !== undefined && size >= 0
      ? {
          [`border${result[1] || ''}${result[1] !== 'Radius' ? 'Width' : ''}`]:
            size,
        }
      : null;
  }
}
