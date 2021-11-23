import { ITokenizer, TokenRule } from "../types/token"
const text: TokenRule = (
  len: number,
  src: string,
  t: ITokenizer,
  silent: Boolean
): Boolean => {
  const rules = t.rules
  const start = t.pos
  const n = rules.length - 1
  t.pos++
  while (t.pos < len) {
    let ok = true
    for (let i = 0; i < n; i++) {
      if (rules[i](len, src, t, true)) {
        ok = false
        break
      }
    }
    if (!ok) {
      break
    }
    t.pos++
  }
  let value = src.slice(start, t.pos)
  let m = value.length
  if (value.charCodeAt(m - 1) === 0x0a) {
    m--
  }
  t.tokens.push({
    type: "text",
    value: value.slice(0, m),
  })
  return true
}
export default text
