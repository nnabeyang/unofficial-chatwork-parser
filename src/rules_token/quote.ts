import { ITokenizer, TokenRule } from "../types/token"
const re = /^\[(qt\]\[qtmeta|引用|引用\]\[qtmeta) aid=(\d+) time=(\d+)\]/
const re2 = /^\[\/(qt|引用)\]/
export const qtOpen: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  let m: RegExpMatchArray | null
  if ((m = src.slice(t.pos, t.pos + 50).match(re)) === null) {
    return false
  }
  if (silent) {
    return true
  }
  let pos = t.pos
  t.tokens.push({
    type: "quote_open",
    value: "",
    position: {
      start: pos,
      end: pos + m[1].length,
    },
  })
  pos += m[1].length
  t.tokens.push({
    type: "text",
    value: m[2],
    position: {
      start: pos,
      end: pos + 5 + m[2].length,
    },
  })
  pos += 5 + m[2].length
  t.tokens.push({
    type: "text",
    value: m[3],
    position: {
      start: pos,
      end: pos + 7 + m[3].length,
    },
  })
  t.pos += m[0].length
  return true
}

export const qtClose: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  let m: RegExpMatchArray | null
  if ((m = src.slice(t.pos, t.pos + 50).match(re2)) === null) {
    return false
  }
  if (silent) {
    return true
  }
  t.tokens.push({
    type: "quote_close",
    value: "",
    position: {
      start: t.pos,
      end: t.pos + m[0].length,
    },
  })
  t.pos += m[0].length
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  return true
}
