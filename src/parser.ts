import { Link, Text, ThematicBreak } from "mdast"
import { Content, Info, InfoBody, InfoHeading } from "./types/node"
import { parse } from "./types/parser"
import { ITokenizer, Token } from "./types/token"
const parseRoot: parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  let token: Token = t.peek()
  if (parentType === "info") {
    parseTitle(t, parentType, contents)
  }
  while (
    (token = t.peek()) &&
    token.type !== "eof" &&
    !(parentType === "info" && token.type === "info_close")
  ) {
    switch (token.type) {
      case "hr":
        parseHr(t, parentType, contents)
        break
      case "info_open":
        parseInfo(t, parentType, contents)
        break
      case "link":
        parseLink(t, parentType, contents)
        break
      case "text":
      case "info_close":
      case "title_open":
      case "title_close":
        parseText(t, parentType, contents)
    }
  }
}
export default parseRoot
const parseText: parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  let tokens: Token[] = []
  tokens.push(t.next())
  let token: Token
  while (
    (token = t.peek()) &&
    token.type !== "eof" &&
    token.type !== "info_open" &&
    token.type !== "hr" &&
    token.type !== "link" &&
    !(parentType === "info" && token.type === "info_close")
  ) {
    tokens.push(t.next())
  }
  let content: Text = {
    type: "text",
    value: tokens.map((token) => token.value).join(""),
  }
  contents.push(content)
}
const parseTitle: parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  if (t.peek().type !== "title_open") {
    return
  }
  let token: Token = t.next()
  const tokens: Token[] = []
  tokens.push(token)

  while (
    (token = t.next()) &&
    token.type !== "eof" &&
    token.type !== "title_close"
  ) {
    tokens.push(token)
  }
  if (token.type === "title_close") {
    const text: Text = {
      type: "text",
      value: tokens
        .slice(1)
        .map((token) => token.value)
        .join(""),
    }
    const title: InfoHeading = {
      type: "info-heading",
      children: [text],
    }
    contents.push(title)
  } else {
    tokens.push(token)
    const text: Text = {
      type: "text",
      value: tokens.map((token) => token.value).join(""),
    }
    contents.push(text)
    return
  }
}
const parseHr: parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  let content: ThematicBreak = {
    type: "thematicBreak",
  }
  contents.push(content)
  t.next()
}

const parseLink: parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  let token = t.next()
  let txt: Text = {
    type: "text",
    value: token.value,
  }
  let content: Link = {
    type: "link",
    url: token.value,
    children: [txt],
  }
  contents.push(content)
}

const parseInfo: parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  let infoContents: Content[] = []
  let start = t.next()
  parseRoot(t, "info", infoContents)
  if (t.peek().type === "info_close") {
    t.next()
    if (infoContents.length > 0 && infoContents[0].type === "info-heading") {
      const title: InfoHeading = infoContents.shift() as InfoHeading
      if (infoContents.length === 0) {
        let texts: Text[] = []
        texts.push({ type: "text", value: "[info][title]" })
        texts.push(title.children[0] as Text)
        texts.push({ type: "text", value: "[/title][/info]" })
        let content: Text = {
          type: "text",
          value: texts.map((text) => text.value).join(""),
        }
        contents.push(content)
        return
      }
      const body: InfoBody = { type: "info-body", children: infoContents }
      let content: Info = {
        type: "info",
        children: [title, body],
      }
      contents.push(content)
    } else {
      if (infoContents.length === 0) {
        let content: Text = {
          type: "text",
          value: "[info][/info]",
        }
        contents.push(content)
        return
      }
      const body: InfoBody = { type: "info-body", children: infoContents }
      let content: Info = {
        type: "info",
        children: [body],
      }
      contents.push(content)
    }
  } else {
    let tokens: Token[] = []
    tokens.push(start)
    if (infoContents.length > 0 && infoContents[0].type === "info-heading") {
      const title: InfoHeading = infoContents.shift() as InfoHeading
      tokens.push({
        type: "title_open",
        value: "[title]",
      })
      Array.prototype.push.apply(tokens, title.children)
      tokens.push({
        type: "title_close",
        value: "[/title]",
      })
    }
    let content: Text = {
      type: "text",
      value: tokens.map((token) => token.value).join(""),
    }
    contents.push(content)
    Array.prototype.push.apply(contents, infoContents)
  }
}
