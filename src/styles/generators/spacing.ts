import { STEP } from '../Tokens';

function getSpacing(name) {
  if (!name) {
    return STEP;
  }
  const regex = /(\d?\d)x/g;
  const result = regex.exec(name);
  if (result) {
    const n = parseInt(result[1], 10);
    if (n === 0 || n > 0) {
      return n * STEP;
    }
  }
  return null;
}

export default function spacing(name: string) {
  const regex =
    /^(margin|padding)(Top|Bottom|Left|Right|Vertical|Horizontal)?(.*)?/g;
  const result = regex.exec(name);

  if (result) {
    const space = getSpacing(result[3]);
    return space !== null ? { [result[1] + (result[2] || '')]: space } : null;
  }
}
