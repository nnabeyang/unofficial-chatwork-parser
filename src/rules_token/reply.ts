import { ITokenizer, TokenRule } from "../types/token"
const re = /^\[(rp|返信) aid=(\d+) to=(\d+)-(\d+)\]/
const reply: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  let m: RegExpMatchArray | null
  if ((m = src.slice(t.pos, t.pos + 60).match(re)) === null) {
    return false
  }
  if (silent) {
    return true
  }
  let pos = t.pos
  t.tokens.push({
    type: "reply_open",
    value: "",
    position: {
      start: pos,
      end: pos + m[1].length + 1,
    },
  })
  pos += m[1].length + 1
  t.tokens.push({
    type: "text",
    value: m[2],
    position: {
      start: pos,
      end: pos + m[2].length + 5,
    },
  })
  pos += m[2].length + 5
  t.tokens.push({
    type: "text",
    value: m[3],
    position: {
      start: pos,
      end: pos + m[3].length + 4,
    },
  })
  pos += m[3].length + 4
  t.tokens.push({
    type: "text",
    value: m[4],
    position: {
      start: pos,
      end: t.pos + m[0].length,
    },
  })
  t.pos += m[0].length

  return true
}
export default reply
