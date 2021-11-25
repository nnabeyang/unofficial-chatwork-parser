import { Link, Text, ThematicBreak } from "mdast"
import { Point } from "unist"
import {
  Content,
  Info,
  InfoBody,
  InfoHeading,
  Mension,
  PIcon,
  PIconName,
  Plain,
  Quote,
  Reply,
} from "./types/node"
import { IState, ParentType, parse } from "./types/parser"
import { ITokenizer, Token } from "./types/token"

const parseRoot: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  let token: Token = t.peek()
  if (parentType === "info" && token.type === "title_open") {
    parseTitle(state, level, t, parentType, contents)
  }
  while (
    (token = t.peek()) &&
    token.type !== "eof" &&
    !state.contains(parentType, token.type) &&
    !state.contains("title", token.type) &&
    !state.contains("quote", token.type)
  ) {
    switch (token.type) {
      case "hr":
        parseHr(state, level, t, parentType, contents)
        break
      case "picon_open":
        parsePIcon(state, level, t, parentType, contents)
        break
      case "piconname_open":
        parsePIconName(state, level, t, parentType, contents)
        break
      case "mension_open":
        parseMension(state, level, t, parentType, contents)
        break
      case "reply_open":
        parseReply(state, level, t, parentType, contents)
        break
      case "info_open":
        parseInfo(state, level, t, parentType, contents)
        break
      case "quote_open":
        parseQuote(state, level, t, parentType, contents)
        break
      case "link":
        parseLink(state, level, t, parentType, contents)
        break
      case "text":
      case "info_close":
      case "title_open":
      case "title_close":
      case "quote_close":
        parseText(state, level, t, parentType, contents)
        break
      default:
        const _exhaustiveCheck: never = token.type
    }
  }
}

export default parseRoot
const parseText: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  let endToken: Token = t.next()
  let start = endToken.position.start
  let token: Token
  while (
    (token = t.peek()) &&
    (token.type === "text" ||
      token.type === "info_close" ||
      token.type === "title_open" ||
      token.type === "title_close" ||
      token.type === "quote_close") &&
    !state.contains("info", token.type) &&
    !state.contains("title", token.type) &&
    !state.contains("quote", token.type)
  ) {
    endToken = t.next()
  }
  const end = endToken.position.end
  let content: Plain = {
    type: "plain",
    value: t.src.slice(start, end),
    position: {
      start: {
        line: -1,
        column: -1,
        offset: start,
      },
      end: {
        line: -1,
        column: -1,
        offset: end,
      },
    },
  }
  contents.push(content)
}

const parseTitle: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  let titleContents: Content[] = []
  let start: Token = t.next()
  state.push("title")
  parseRoot(state, level + 1, t, "title", titleContents)
  if (state.valid(level + 1) && t.peek().type === "title_close") {
    state.pop()
    let close: Token = t.next()
    if (titleContents.length === 0) {
      let content: Plain = {
        type: "plain",
        value: t.src.slice(start.position.start, close.position.end),
        position: {
          start: {
            line: -1,
            column: -1,
            offset: start.position.start,
          },
          end: {
            line: -1,
            column: -1,
            offset: close.position.end,
          },
        },
      }
      contents.push(content)
      return
    }
    if (titleContents[0].type === "plain") {
      const n = titleContents.length
      let i = 0
      let startPos: number = titleContents[0].position!.start.offset!
      let end: number = startPos
      while (i < n && titleContents[i].type === "plain") {
        end = titleContents[i].position!.end.offset!
        i++
      }
      titleContents = titleContents.slice(i)

      let content: Plain = {
        type: "plain",
        value: t.src.slice(startPos, end),
        position: {
          start: {
            line: -1,
            column: -1,
            offset: startPos,
          },
          end: {
            line: -1,
            column: -1,
            offset: end,
          },
        },
      }
      titleContents.unshift(content)
    }
    let content: InfoHeading = {
      type: "info-heading",
      children: titleContents,
    }
    contents.push(content)
  } else {
    const n = titleContents.length
    let i = 0
    let end: number = start.position.end
    while (i < n && titleContents[i].type === "plain") {
      end = titleContents[i].position!.end.offset!
      i++
    }
    let content: Plain = {
      type: "plain",
      value: t.src.slice(start.position.start, end),
      position: {
        start: {
          line: -1,
          column: -1,
          offset: start.position.start,
        },
        end: {
          line: -1,
          column: -1,
          offset: end,
        },
      },
    }
    contents.push(content)
    Array.prototype.push.apply(contents, titleContents.slice(i))
  }
}
const parseHr: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  let content: ThematicBreak = {
    type: "thematicBreak",
  }
  contents.push(content)
  t.next()
}

const parsePIcon: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  const start = t.next()
  const end = t.next()
  let content: PIcon = {
    type: "picon",
    value: end.value,
    position: {
      start: {
        line: -1,
        column: -1,
        offset: start.position.start,
      },
      end: {
        line: -1,
        column: -1,
        offset: end.position.end,
      },
    },
  }
  contents.push(content)
}

const parsePIconName: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: string,
  contents: Content[]
): void => {
  t.next()
  let content: PIconName = {
    type: "piconname",
    value: t.next().value,
  }
  contents.push(content)
}

const parseMension: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  t.next()
  let content: Mension = {
    type: "mension",
    value: t.next().value,
  }
  contents.push(content)
}

const parseReply: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  t.next()
  let content: Reply = {
    type: "reply",
    aid: t.next().value,
    rid: t.next().value,
    mid: t.next().value,
  }
  contents.push(content)
}

const parseLink: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
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
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  let infoContents: Content[] = []
  let start = t.next()
  state.push("info")
  parseRoot(state, level + 1, t, "info", infoContents)
  if (state.valid(level + 1) && t.peek().type === "info_close") {
    state.pop()
    let close: Token = t.next()
    if (infoContents.length > 0 && infoContents[0].type === "info-heading") {
      const title: InfoHeading = infoContents.shift() as InfoHeading
      if (infoContents.length === 0) {
        if (title.children.length > 0) {
          let children = title.children
          const n = children.length
          let i = 0
          let end: number = start.position.end
          while (i < n && children[i].type === "plain") {
            end = children[i].position!.end.offset!
            i++
          }
          children = children.slice(i)
          if (children.length > 0) {
            contents.push({
              type: "plain",
              value: t.src.slice(
                start.position.start,
                children[0].position!.start.offset
              ),
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: start.position.start,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: children[0].position!.start.offset,
                },
              },
            })
            if (children[children.length - 1].type === "plain") {
              let start = children.pop()
              Array.prototype.push.apply(contents, children)
              let startPos = start!.position!.start.offset
              contents.push({
                type: "plain",
                value: t.src.slice(startPos, close.position.end),
                position: {
                  start: {
                    line: -1,
                    column: -1,
                    offset: startPos,
                  },
                  end: {
                    line: -1,
                    column: -1,
                    offset: close.position.end,
                  },
                },
              })
            } else {
              Array.prototype.push.apply(contents, children)
              let startPos = children[children.length - 1].position!.end.offset!
              contents.push({
                type: "plain",
                value: t.src.slice(startPos, close.position.end),
                position: {
                  start: {
                    line: -1,
                    column: -1,
                    offset: startPos,
                  },
                  end: {
                    line: -1,
                    column: -1,
                    offset: close.position.end,
                  },
                },
              })
            }
          } else {
            contents.push({
              type: "plain",
              value: t.src.slice(start.position.start, close.position.end),
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: start.position.start,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: close.position.end,
                },
              },
            })
          }
        } else {
          const text: Plain = {
            type: "plain",
            value: t.src.slice(start.position.start, close.position.end),
            position: {
              start: {
                line: -1,
                column: -1,
                offset: start.position.start,
              },
              end: {
                line: -1,
                column: -1,
                offset: close.position.end,
              },
            },
          }
          contents.push(text)
        }
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
        let content: Plain = {
          type: "plain",
          value: t.src.slice(start.position.start, close.position.end),
          position: {
            start: {
              line: -1,
              column: -1,
              offset: start.position.start,
            },
            end: {
              line: -1,
              column: -1,
              offset: close.position.end,
            },
          },
        }
        contents.push(content)
        return
      }
      if (infoContents[0].type === "plain") {
        const n = infoContents.length
        let i = 0
        let end: number = start.position.end
        let startPosition = infoContents[0].position!
        while (i < n && infoContents[i].type === "plain") {
          end = infoContents[i].position!.end.offset!
          i++
        }
        infoContents = infoContents.slice(i)
        let content: Plain = {
          type: "plain",
          value: t.src.slice(startPosition.start.offset!, end),
          position: {
            start: startPosition.start,
            end: {
              line: -1,
              column: -1,
              offset: end,
            },
          },
        }
        infoContents.unshift(content)
      }
      const body: InfoBody = { type: "info-body", children: infoContents }
      let content: Info = {
        type: "info",
        children: [body],
      }
      contents.push(content)
    }
  } else {
    const n = infoContents.length
    let i = 0
    let end: number = start.position.end
    while (i < n && infoContents[i].type === "plain") {
      end = infoContents[i].position!.end.offset!
      i++
    }
    let content: Plain = {
      type: "plain",
      value: t.src.slice(start.position.start, end),
      position: {
        start: {
          line: -1,
          column: -1,
          offset: start.position.start,
        },
        end: {
          line: -1,
          column: -1,
          offset: end,
        },
      },
    }
    contents.push(content)
    Array.prototype.push.apply(contents, infoContents.slice(i))
  }
}

const parseQuote: parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
): void => {
  let qtContents: Content[] = []
  let start: [Token, Token, Token] = [t.next(), t.next(), t.next()]
  state.push("quote")
  parseRoot(state, level + 1, t, "quote", qtContents)
  if (state.valid(level + 1) && t.peek().type === "quote_close") {
    state.pop()
    const close: Token = t.next()
    if (qtContents.length === 0) {
      let content: Plain = {
        type: "plain",
        value: t.src.slice(start[0].position.start, close.position.end),
        position: {
          start: {
            line: -1,
            column: -1,
            offset: start[0].position.start,
          },
          end: {
            line: -1,
            column: -1,
            offset: close.position.end,
          },
        },
      }
      contents.push(content)
      return
    }
    if (qtContents[0].type === "plain") {
      let start: Point = qtContents[0].position!.start
      let end: Point = qtContents[0].position!.end
      const n = qtContents.length
      let i = 0
      while (i < n && qtContents[i].type === "plain") {
        end = qtContents[i].position!.end
        i++
      }
      qtContents = qtContents.slice(i)
      let content: Plain = {
        type: "plain",
        value: t.src.slice(start.offset!, end.offset!),
        position: {
          start,
          end,
        },
      }
      qtContents.unshift(content)
    }
    let content: Quote = {
      type: "quote",
      aid: start[1].value,
      time: +start[2].value,
      children: qtContents,
    }
    contents.push(content)
  } else {
    const startPoint: Point = {
      line: -1,
      column: -1,
      offset: start[0].position.start,
    }
    let endPoint: Point = {
      line: -1,
      column: -1,
      offset: start[0].position.end,
    }
    if (qtContents.length > 0 && qtContents[0].type === "plain") {
      endPoint = qtContents.shift()!.position!.end
    }
    let content: Plain = {
      type: "plain",
      value: t.src.slice(startPoint.offset!, endPoint.offset!),
      position: {
        start: startPoint,
        end: endPoint,
      },
    }
    contents.push(content)
    Array.prototype.push.apply(contents, qtContents)
  }
}
