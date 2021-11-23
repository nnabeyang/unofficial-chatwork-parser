import { ITokenizer, TokenRule } from "../types/token"
const hr: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  if (len - t.pos < 4 || src.slice(t.pos, t.pos + 4) !== "[hr]") {
    return false
  }
  if (silent) {
    return true
  }
  t.tokens.push({
    type: "hr",
    value: "[hr]",
  })
  t.pos += 4
  if (src.charCodeAt(t.pos) === 0x0a) {
    t.pos++
  }
  return true
}
export default hr
