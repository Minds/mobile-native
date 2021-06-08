import type { ThemedStylesStore } from '../ThemedStyles';

export default function colors(name: string, ts: ThemedStylesStore) {
  if (name.startsWith('bg')) {
    return {
      backgroundColor: ts.getColor(name.substr(2)),
    };
  }
  if (name.startsWith('color')) {
    return {
      color: ts.getColor(name.substr(5)),
    };
  }
  if (name.startsWith('bcolor')) {
    return {
      borderColor: ts.getColor(name.substr(6)),
    };
  }
  if (name.startsWith('shadow')) {
    return {
      borderColor: ts.getColor(name.substr(6)),
    };
  }
}
