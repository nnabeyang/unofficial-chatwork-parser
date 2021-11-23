import LinkifyIt from "linkify-it"
import hr from "./rules_token/hr"
import { infoClose, infoOpen } from "./rules_token/info"
import text from "./rules_token/text"
import { titleClose, titleOpen } from "./rules_token/title"
import { ITokenizer, Token, TokenRule } from "./types/token"
export default class Tokenizer implements ITokenizer {
  tokens: Token[]
  pos: number
  rules: TokenRule[] = [infoOpen, infoClose, titleOpen, titleClose, hr, text]

  constructor(src: string) {
    this.tokens = []
    this.pos = 0
    const len = src.length
    const n = this.rules.length
    while (this.pos < len) {
      for (let i = 0; i < n; i++) {
        if (this.rules[i](len, src, this, false)) {
          break
        }
      }
    }
  }
  next(): Token {
    let token: Token | undefined = this.tokens.shift()
    if (typeof token === "undefined") {
      return {
        type: "eof",
        value: "",
      }
    }
    return token
  }
  peek(): Token {
    if (this.tokens.length === 0) {
      return { type: "eof", value: "" }
    }
    return this.tokens[0]
  }
}

export class LinkifyTokenizer implements ITokenizer {
  tokens: Token[]
  rules: TokenRule[]
  pos: number
  constructor(t: Tokenizer) {
    this.tokens = []
    this.rules = t.rules
    this.pos = 0
    const linkify = new LinkifyIt()
    let token: Token
    while ((token = t.next()) && token.type !== "eof") {
      if (token.type === "text" && linkify.test(token.value)) {
        let text = token.value
        let links = linkify.match(text)
        let lastPos = 0
        if (links === null) {
          continue
        }
        const n = links.length
        for (let i = 0; i < n; i++) {
          let link = links[i]
          const pos = link.index
          if (pos > lastPos) {
            let txt: Token = {
              type: "text",
              value: text.slice(lastPos, pos),
            }
            this.tokens.push(txt)
          }
          let lnk: Token = {
            type: "link",
            value: link.url,
          }
          this.tokens.push(lnk)
          lastPos = link.lastIndex
        }
        if (lastPos < text.length) {
          let txt: Token = {
            type: "text",
            value: text.slice(lastPos),
          }
          this.tokens.push(txt)
        }
      } else {
        this.tokens.push(token)
      }
    }
  }
  next(): Token {
    let token: Token | undefined = this.tokens.shift()
    if (typeof token === "undefined") {
      return {
        type: "eof",
        value: "",
      }
    }
    return token
  }
  peek(): Token {
    if (this.tokens.length === 0) {
      return { type: "eof", value: "" }
    }
    return this.tokens[0]
  }
}
