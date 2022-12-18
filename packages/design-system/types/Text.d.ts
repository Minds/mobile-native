export declare const Text: import('@tamagui/core').TamaguiComponent<
  Omit<import('react-native').TextProps, 'children'> &
    import('@tamagui/core').RNWTextProps &
    import('@tamagui/core').TamaguiComponentPropsBase &
    import('@tamagui/core').WithThemeValues<
      import('@tamagui/core').TextStylePropsBase
    > &
    import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<
        import('@tamagui/core').TextStylePropsBase
      >
    > &
    Omit<
      | {
          readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
        }
      | ({
          readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
        } & {
          [x: string]: undefined;
        }),
      'type'
    > & {
      readonly type?: 'black' | 'bold' | 'medium' | 'regular' | undefined;
    } & import('@tamagui/core').MediaProps<
      Partial<
        Omit<import('react-native').TextProps, 'children'> &
          import('@tamagui/core').RNWTextProps &
          import('@tamagui/core').TamaguiComponentPropsBase &
          import('@tamagui/core').WithThemeValues<
            import('@tamagui/core').TextStylePropsBase
          > &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            >
          > &
          Omit<
            | {
                readonly size?:
                  | import('@tamagui/core').FontSizeTokens
                  | undefined;
              }
            | ({
                readonly size?:
                  | import('@tamagui/core').FontSizeTokens
                  | undefined;
              } & {
                [x: string]: undefined;
              }),
            'type'
          > & {
            readonly type?: 'black' | 'bold' | 'medium' | 'regular' | undefined;
          }
      >
    > &
    import('@tamagui/core').PseudoProps<
      Partial<
        Omit<import('react-native').TextProps, 'children'> &
          import('@tamagui/core').RNWTextProps &
          import('@tamagui/core').TamaguiComponentPropsBase &
          import('@tamagui/core').WithThemeValues<
            import('@tamagui/core').TextStylePropsBase
          > &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            >
          > &
          Omit<
            | {
                readonly size?:
                  | import('@tamagui/core').FontSizeTokens
                  | undefined;
              }
            | ({
                readonly size?:
                  | import('@tamagui/core').FontSizeTokens
                  | undefined;
              } & {
                [x: string]: undefined;
              }),
            'type'
          > & {
            readonly type?: 'black' | 'bold' | 'medium' | 'regular' | undefined;
          }
      >
    >,
  import('@tamagui/core').TamaguiElement,
  import('@tamagui/core').TextPropsBase,
  (
    | {
        readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
      }
    | ({
        readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
      } & {
        [x: string]: undefined;
      })
  ) & {
    readonly type?: 'black' | 'bold' | 'medium' | 'regular' | undefined;
  }
>;
//# sourceMappingURL=Text.d.ts.map
