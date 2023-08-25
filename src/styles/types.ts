import { ColorsType } from './Colors';
import { UIUnitType } from './Tokens';

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A['length'] ? 0 : 1];

type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[]
  ? E
  : never;

type NonZeroDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type NumberHelper = {
  [P in NonZeroDigit]: {
    [Z in NonZeroDigit]: `${P}${Z}`;
  };
};

type NestedValues<T extends Record<string, Record<string, string>>> = {
  [P in keyof T]: P extends string ? Values<T[P]> : never;
};
type Values<T> = T[keyof T];

type RemoveTrailingZero<T extends string> = T extends `${infer Fst}${infer Snd}`
  ? Fst extends `0`
    ? `${Snd}`
    : `${Fst}${Snd}`
  : never;

type Numbers_99 = RemoveTrailingZero<Values<NestedValues<NumberHelper>>>;

type ThemeSuffix = '_Light' | '_Dark';

export type DynamicStyles = {
  [key in Enumerate<30> as
    | `border${key}x`
    | `borderRight${key}x`
    | `borderTop${key}x`
    | `borderBottom${key}x`
    | `borderRadius${key}x`
    | `borderLeft${key}x`
    | `paddingVertical${key}x`
    | `paddingTop${key}x`
    | `paddingLeft${key}x`
    | `paddingRight${key}x`
    | `paddingBottom${key}x`
    | `paddingHorizontal${key}x`
    | `padding${key}x`
    | `marginVertical${key}x`
    | `marginTop${key}x`
    | `marginLeft${key}x`
    | `marginRight${key}x`
    | `marginBottom${key}x`
    | `marginHorizontal${key}x`
    | `margin${key}x`]: any;
} & {
  border: any;
  borderRight: any;
  borderTop: any;
  borderBottom: any;
  borderRadius: any;
  borderLeft: any;
  paddingVertical: any;
  paddingTop: any;
  paddingLeft: any;
  paddingRight: any;
  paddingBottom: any;
  paddingHorizontal: any;
  padding: any;
  marginVertical: any;
  marginTop: any;
  marginLeft: any;
  marginRight: any;
  marginBottom: any;
  marginHorizontal: any;
  margin: any;
} & {
  [key in Numbers_99 as `width${key}` | `height${key}`];
} & {
  [key in keyof ColorsType as
    | `bg${key}`
    | `bg${key}${ThemeSuffix}`
    | `color${key}`
    | `color${key}${ThemeSuffix}`
    | `bcolor${key}`
    | `bcolor${key}${ThemeSuffix}`
    | `shadow${key}`
    | `shadow${key}${ThemeSuffix}`];
} & {
  [key in UIUnitType as
    | `paddingVertical${key}`
    | `paddingTop${key}`
    | `paddingLeft${key}`
    | `paddingRight${key}`
    | `paddingBottom${key}`
    | `paddingHorizontal${key}`
    | `padding${key}`
    | `marginVertical${key}`
    | `marginTop${key}`
    | `marginLeft${key}`
    | `marginRight${key}`
    | `marginBottom${key}`
    | `marginHorizontal${key}`
    | `margin${key}`]: any;
};
