import { ITokenizer, TokenRule } from "../types/token"
const re = /^\[(picon|piconname|To):(\d+)\]/
const picon: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  let m: RegExpMatchArray | null
  if (
    len - t.pos < 9 ||
    (m = src.slice(t.pos, t.pos + 20).match(re)) === null
  ) {
    return false
  }
  if (silent) {
    return true
  }
  switch (m[1]) {
    case "picon":
      t.tokens.push({
        type: "picon_open",
        value: "",
        position: {
          start: t.pos,
          end: t.pos + 7,
        },
      })
      t.tokens.push({
        type: "text",
        value: m[2],
        position: {
          start: t.pos + 7,
          end: t.pos + m[0].length,
        },
      })
      break
    case "piconname":
      t.tokens.push({
        type: "piconname_open",
        value: "",
        position: {
          start: t.pos,
          end: t.pos + 11,
        },
      })
      t.tokens.push({
        type: "text",
        value: m[2],
        position: {
          start: t.pos + 11,
          end: t.pos + m[0].length,
        },
      })
      break
    case "To":
      let pos = t.pos
      t.tokens.push({
        type: "mension_open",
        value: "",
        position: {
          start: t.pos,
          end: pos + 4,
        },
      })
      pos += 4
      t.tokens.push({
        type: "text",
        value: m[2],
        position: {
          start: pos,
          end: t.pos + m[0].length,
        },
      })
      break
    default:
      return false
  }
  t.pos += m[0].length

  return true
}
export default picon
