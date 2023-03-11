import LinkifyIt from "linkify-it"
import hr from "./rules_token/hr"
import { infoClose, infoOpen } from "./rules_token/info"
import picon from "./rules_token/picon"
import { qtClose, qtOpen } from "./rules_token/quote"
import { codeClose, codeOpen } from "./rules_token/code"
import reply from "./rules_token/reply"
import text from "./rules_token/text"
import { titleClose, titleOpen } from "./rules_token/title"
import { ITokenizer, Token, TokenRule } from "./types/token"
export default class Tokenizer implements ITokenizer {
  tokens: Token[]
  pos: number
  src: string
  rules: TokenRule[] = [
    qtOpen,
    qtClose,
    codeOpen,
    codeClose,
    infoOpen,
    infoClose,
    titleOpen,
    titleClose,
    hr,
    picon,
    reply,
    text,
  ]

  constructor(src: string) {
    this.src = src
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
        position: {
          start: this.src.length,
          end: this.src.length,
        },
      }
    }
    return token
  }
  peek(): Token {
    if (this.tokens.length === 0) {
      return {
        type: "eof",
        value: "",
        position: {
          start: this.src.length,
          end: this.src.length,
        },
      }
    }
    return this.tokens[0]
  }
}

export class LinkifyTokenizer implements ITokenizer {
  tokens: Token[]
  rules: TokenRule[]
  pos: number
  src: string
  constructor(t: Tokenizer) {
    this.tokens = []
    this.rules = t.rules
    this.pos = 0
    this.src = t.src
    const linkify = new LinkifyIt()
    let token: Token
    while ((token = t.next()) && token.type !== "eof") {
      if (token.type === "text" && linkify.test(token.value)) {
        let text = token.value
        let start = token.position.start
        const end = token.position.end
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
            const v = text.slice(lastPos, pos)
            let txt: Token = {
              type: "text",
              value: v,
              position: {
                start,
                end: start + v.length,
              },
            }
            this.tokens.push(txt)
            start += v.length
          }
          let lnk: Token = {
            type: "link",
            value: link.url,
            position: {
              start,
              end: start + link.url.length,
            },
          }
          this.tokens.push(lnk)
          lastPos = link.lastIndex
          start += link.url.length
        }
        if (lastPos < text.length) {
          const v = text.slice(lastPos)
          let txt: Token = {
            type: "text",
            value: v,
            position: {
              start,
              end: start + v.length,
            },
          }
          this.tokens.push(txt)
          start = start + v.length
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
        position: {
          start: 0,
          end: 0,
        },
      }
    }
    return token
  }
  peek(): Token {
    if (this.tokens.length === 0) {
      return {
        type: "eof",
        value: "",
        position: {
          start: 0,
          end: 0,
        },
      }
    }
    return this.tokens[0]
  }
}
