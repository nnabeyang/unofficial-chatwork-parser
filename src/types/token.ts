export type TokenType =
  | "text"
  | "info_open"
  | "info_close"
  | "title_open"
  | "title_close"
  | "link"
  | "hr"
  | "picon_open"
  | "piconname_open"
  | "mension_open"
  | "reply_open"
  | "quote_open"
  | "quote_close"
  | "code_open"
  | "code_close"
  | "eof"
interface Position {
  start: number
  end: number
}
export interface Token {
  type: TokenType
  value: string
  position: Position
}

export interface ITokenizer {
  tokens: Token[]
  rules: TokenRule[]
  pos: number
  src: string
  next(): Token
  peek(): Token
}
export type TokenRule = (
  len: number,
  src: string,
  tokenizer: ITokenizer,
  silent: Boolean
) => Boolean
