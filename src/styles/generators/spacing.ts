import { STEP, UIUnitType, UNIT } from '../Tokens';

function getSpacing(name) {
  if (!name) {
    return STEP;
  }
  const regex = /(\d?\d)x/g;
  const result = regex.exec(name);
  if (result) {
    const n = parseInt(result[1], 10);
    if (n > 0) {
      return n * STEP;
    }
    if (n === 0) {
      return STEP / 4;
    }
  }
  return null;
}

function getFixedSpacing(name: UIUnitType) {
  return UNIT[name];
}

export default function spacing(name: string) {
  const regex =
    /^(margin|padding)(Top|Bottom|Left|Right|Vertical|Horizontal)?(.*)?/g;
  const result = regex.exec(name);

  if (result) {
    const space =
      !result[3] || name[name.length - 1] === 'x'
        ? getSpacing(result[3])
        : getFixedSpacing(result[3] as UIUnitType);

    return space !== null ? { [result[1] + (result[2] || '')]: space } : null;
  }
}
