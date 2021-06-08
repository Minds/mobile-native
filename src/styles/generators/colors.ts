import { ColorsNameType } from '../Colors';
import type { ThemedStylesStore } from '../ThemedStyles';

export default function colors(name: string, ts: ThemedStylesStore) {
  if (name.startsWith('bg')) {
    return {
      backgroundColor: ts.getColor(name.substr(2) as ColorsNameType),
    };
  }
  if (name.startsWith('color')) {
    return {
      color: ts.getColor(name.substr(5) as ColorsNameType),
    };
  }
  if (name.startsWith('bcolor')) {
    return {
      borderColor: ts.getColor(name.substr(6) as ColorsNameType),
    };
  }
  if (name.startsWith('shadow')) {
    return {
      borderColor: ts.getColor(name.substr(6) as ColorsNameType),
    };
  }
}
