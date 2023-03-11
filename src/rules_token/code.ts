import { ITokenizer, TokenRule } from "../types/token"

export const codeOpen: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 6 || src.slice(t.pos, t.pos + 6) !== "[code]") {
    return false
  }
  if (silent) {
    return true
  }
  t.tokens.push({
    type: "code_open",
    value: "",
    position: {
      start: t.pos,
      end: t.pos + 6,
    },
  })
  t.pos += 6
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  return true
}
export const codeClose: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 7 || src.slice(t.pos, t.pos + 7) !== "[/code]") {
    return false
  }
  if (silent) {
    return true
  }
  const start = t.pos
  t.pos += 7
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  t.tokens.push({
    type: "code_close",
    value: "",
    position: {
      start,
      end: t.pos,
    },
  })
  return true
}
