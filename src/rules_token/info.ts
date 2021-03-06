import { ITokenizer, TokenRule } from "../types/token"
export const infoOpen: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 6 || src.slice(t.pos, t.pos + 6) !== "[info]") {
    return false
  }
  if (silent) {
    return true
  }
  const start = t.pos
  t.pos += 6
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  t.tokens.push({
    type: "info_open",
    value: "",
    position: {
      start,
      end: t.pos,
    },
  })
  return true
}

export const infoClose: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 7 || src.slice(t.pos, t.pos + 7) !== "[/info]") {
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
    type: "info_close",
    value: "",
    position: {
      start,
      end: t.pos,
    },
  })
  return true
}
