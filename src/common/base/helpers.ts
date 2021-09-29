import ThemedStyles from '~styles/ThemedStyles';

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export const getNumericSize = (size, options, default_size) => {
  if (typeof size === 'string') {
    return options[size] || options[default_size];
  }

  return getClosestSize(size, Object.values(options));
};

export const getNamedSize = (size, options, default_size) => {
  if (typeof size === 'string') {
    return size;
  }
  if (!size) {
    return default_size;
  }

  const closest = getClosestSize(size, Object.values(options));

  return getKeyByValue(options, closest);
};

export const getClosestSize = (size: number, options: any[]) => {
  return options
    .sort((a, b) => a - b)
    .reduce((a, b) => {
      return Math.abs(b - size) < Math.abs(a - size) ? b : a;
    });
};

export const getPropStyles = (props: any) => {
  const styles: any = [];
  if (!(props && typeof props === 'object')) {
    return styles;
  }

  const keys = Object.keys(props);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (!key.match(/margin/)) {
      continue;
    }
    const label = `${key}${props[key]}`;
    const style = ThemedStyles.style[label];

    if (style) {
      styles.push(style);
    }
  }

  return styles;
};
