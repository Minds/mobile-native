import { Variable } from '@tamagui/core';
declare const semanticNames: readonly [
  'basic',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
];
type SemanticName = typeof semanticNames[number];
export type SimpleTheme = {
  background: string | Variable<any> | Variable<string>;
  backgroundFocus: string | Variable<any> | Variable<string>;
  backgroundPress: string | Variable<any> | Variable<string>;
  backgroundHover: string | Variable<any> | Variable<string>;
  backgroundDisabled?: string | Variable<any> | Variable<string>;
  borderColor: string | Variable<any> | Variable<string>;
  borderColorFocus: string | Variable<any> | Variable<string>;
  borderColorPress: string | Variable<any> | Variable<string>;
  borderColorHover: string | Variable<any> | Variable<string>;
  color: string | Variable<any> | Variable<string>;
  colorFocus: string | Variable<any> | Variable<string>;
  colorPress: string | Variable<any> | Variable<string>;
  colorHover: string | Variable<any> | Variable<string>;
};
export declare const createSemanticTheme: (theme: SemanticName) => SimpleTheme;
export declare const sematicThemes: {
  dark_basic: SimpleTheme;
  light_basic: SimpleTheme;
  dark_primary: SimpleTheme;
  light_primary: SimpleTheme;
  dark_info: SimpleTheme;
  light_info: SimpleTheme;
  dark_success: SimpleTheme;
  light_success: SimpleTheme;
  dark_warning: SimpleTheme;
  light_warning: SimpleTheme;
  dark_danger: SimpleTheme;
  light_danger: SimpleTheme;
};
export {};
//# sourceMappingURL=semanticTheme.d.ts.map
