export type ThumbSize = 'small' | 'medium' | 'large' | 'xlarge';

export type Optionalize<T extends K, K> = Omit<T, keyof K>;
