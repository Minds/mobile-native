const STEP = 1;
const multiplier = 1;

function getBorder(name) {
  if (!name) {
    return STEP * multiplier;
  }
  const regex = /(\d?\d)x/g;
  const result = regex.exec(name);

  if (result) {
    const n = parseInt(result[2], 10);
    if (n === 0 || n > 0) {
      return n * STEP * multiplier;
    }
  }
}

export default function borders(name: string) {
  const regex = /^border(Top|Bottom|Left|Right|Vertical|Horizontal|Radius)?(.*)/g;
  const result = regex.exec(name);

  if (result) {
    const size = getBorder(result[3]);
    return size ? { [`border${result[2] || ''}Width`]: size } : null;
  }
}
