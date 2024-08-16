export declare const INDENT = '   '
export declare const p: (m?: string) => void
export declare const heading: (m?: string) => void
export declare const command: (
  m?:
    | string
    | {
        m: string
        width: number
      },
  second?: string,
  examples?: string[]
) => void
export declare const direction: (m?: string) => void
export declare const warning: (m?: string) => void
export declare const cliHeader: () => void
export declare const hr: () => void
export declare const prettyprint: {
  command: (
    m?:
      | string
      | {
          m: string
          width: number
        },
    second?: string,
    examples?: string[]
  ) => void
  direction: (m?: string) => void
  heading: (m?: string) => void
  hr: () => void
  cliHeader: () => void
  p: (m?: string) => void
  warning: (m?: string) => void
}
/**
 * enquirer style customization
 * @see https://github.dev/enquirer/enquirer/blob/36785f3399a41cd61e9d28d1eb9c2fcd73d69b4c/examples/select/option-elements.js#L19
 */
export declare const prefix: (state: {
  status: 'pending' | 'submitted' | 'canceled'
}) => string
export declare const icons: {
  done: string
  failed: string
  warning: string
}
export declare const prettyJson: (json: any) => string
/** Format displayed messages for prompts */
export declare const format: {
  /** Format boolean values for human on prompts  */
  boolean: (value: string) => string | Promise<string>
}
export declare const prettyPrompt: {
  format: {
    /** Format boolean values for human on prompts  */
    boolean: (value: string) => string | Promise<string>
  }
}
export declare const startSpinner: (m?: string) => import('ora').Ora
export declare const stopSpinner: (m: string, symbol: string) => void
export declare const stopLastSpinner: (symbol: string) => void
export declare const clearSpinners: () => void
export declare const spinner: {
  readonly start: (m?: string) => import('ora').Ora
  readonly stop: (m: string, symbol: string) => void
  readonly stopLast: (symbol: string) => void
  readonly clear: () => void
}
export declare const link: (m?: string) => string
export declare const em: (m?: string) => string
export declare const ir: (m?: string) => string
export declare const highlight: (m?: string) => string
export declare const theme: {
  em: (m?: string) => string
  highlight: (m?: string) => string
  link: (m?: string) => string
  ir: (m?: string) => string
}
