import { createTokens } from '@tamagui/core';
import { color } from './colors';

// should roughly map to button/input etc height at each level
// fonts should match that height/lineHeight at each stop
// so these are really non-linear on purpose
// why?
//   - at sizes <1, used for fine grained things (borders, smallest paddingY)
//     - so smallest padY should be roughly 1-4px so it can join with lineHeight
//   - at sizes >=1, have to consider "pressability" (jumps up)
//   - after that it should go upwards somewhat naturally
//   - H1 / headings top out at 10 naturally, so after 10 we can go upwards faster
//  but also one more wrinkle...
//  space is used in conjunction with size
//  i'm setting space to generally just a fixed fraction of size (~1/3-2/3 still fine tuning)
export const size = {
  $0: 0,
  '$0.25': 2,
  '$0.5': 4,
  '$0.6': 5,
  '$0.75': 8,
  $1: 20,
  '$1.5': 24,
  $2: 28,
  '$2.5': 32,
  $3: 36,
  '$3.5': 40,
  $4: 44,
  $true: 44,
  '$4.5': 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $13: 164,
  $14: 184,
  $15: 204,
  $16: 224,
  $17: 224,
  $18: 244,
  $19: 264,
  $20: 284,
};

type SizeKeysIn = keyof typeof size;
type Sizes = {
  [Key in SizeKeysIn extends `$${infer Key}` ? Key : SizeKeysIn]: number;
};

const spaces = {
  '$0.5': 2,
  $1: 4,
  '$1.5': 6,
  $2: 8,
  $3: 12,
  '$3.5': 14,
  $4: 16,
  $5: 24,
  $6: 32,
  $7: 40,
  $8: 48,
  $9: 59,
  $10: 64,
};

type SpacesKeysIn = keyof typeof spaces;
type Spaces = {
  [Key in SpacesKeysIn extends `$${infer Key}` ? Key : SpacesKeysIn]: number;
};

// TODO: Add negatives
export const space = { 0: 0, ...spaces };

export const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
};

export const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 6,
  4: 8,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
};

export const tokens = createTokens({
  color,
  radius,
  zIndex,
  space: (space as any) as Spaces,
  size: (size as any) as Sizes, // took from tamagui theme-base code
});
