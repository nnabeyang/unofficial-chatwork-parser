export type TokenType =
  | "text"
  | "info_open"
  | "info_close"
  | "title_open"
  | "title_close"
  | "link"
  | "hr"
  | "eof"
export interface Token {
  type: TokenType
  value: string
}
export interface ITokenizer {
  tokens: Token[]
  rules: TokenRule[]
  pos: number
  next(): Token
  peek(): Token
}
export type TokenRule = (
  len: number,
  src: string,
  tokenizer: ITokenizer,
  silent: Boolean
) => Boolean
