import { ITokenizer, TokenRule } from "../types/token"

export const titleOpen: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 7 || src.slice(t.pos, t.pos + 7) !== "[title]") {
    return false
  }
  if (silent) {
    return true
  }
  t.tokens.push({
    type: "title_open",
    value: "",
    position: {
      start: t.pos,
      end: t.pos + 7,
    },
  })
  t.pos += 7
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  return true
}
export const titleClose: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 8 || src.slice(t.pos, t.pos + 8) !== "[/title]") {
    return false
  }
  if (silent) {
    return true
  }
  const start = t.pos
  t.pos += 8
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  t.tokens.push({
    type: "title_close",
    value: "",
    position: {
      start,
      end: t.pos,
    },
  })
  return true
}
