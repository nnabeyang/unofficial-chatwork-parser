import parse from "../src/parser"
import State from "../src/state"
import Tokenizer, { LinkifyTokenizer } from "../src/tokenizer"
import { Content } from "../src/types/node"

test("text", () => {
  let t = new Tokenizer(`hello
world`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "hello\nworld",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 11,
        },
      },
    },
  ])
})

test("hr", () => {
  let t = new Tokenizer(`hello[hr]world`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)

  expect(contents).toEqual([
    {
      type: "plain",
      value: "hello",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 5,
        },
      },
    },
    {
      type: "thematicBreak",
    },
    {
      type: "plain",
      value: "world",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 9,
        },
        end: {
          line: -1,
          column: -1,
          offset: 14,
        },
      },
    },
  ])
})

test("hr2", () => {
  let t = new Tokenizer(`hello[hr]
world`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "hello",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 5,
        },
      },
    },
    {
      type: "thematicBreak",
    },
    {
      type: "plain",
      value: "world",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 10,
        },
        end: {
          line: -1,
          column: -1,
          offset: 15,
        },
      },
    },
  ])
})

test("info", () => {
  let t = new Tokenizer(`[info]hello[/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("info with title", () => {
  let t = new Tokenizer(`[info][title]TITLE[/title]BODY[/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-heading",
          children: [
            {
              type: "plain",
              value: "TITLE",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 13,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 18,
                },
              },
            },
          ],
        },
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "BODY",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 26,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 30,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("info with title2", () => {
  let t = new Tokenizer(
    `[info][title]TITLE http://example.com[/title]BODY[/info]`
  )
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-heading",
          children: [
            {
              type: "plain",
              value: "TITLE ",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 13,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 19,
                },
              },
            },
            {
              type: "link",
              url: "http://example.com",
              children: [
                {
                  type: "text",
                  value: "http://example.com",
                },
              ],
            },
          ],
        },
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "BODY",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 45,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 49,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("info with title(broken)", () => {
  let t = new Tokenizer(`[info]BODY1[title]TITLE[/title]BODY2`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[info]BODY1[title]TITLE[/title]BODY2",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 36,
        },
      },
    },
  ])
})

test("info with title2(broken)", () => {
  let t = new Tokenizer(`[info]BODY1[title]TITLE BODY2[/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "BODY1[title]TITLE BODY2",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 29,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("info with title3(broken)", () => {
  let t = new Tokenizer(`[info]BODY1[title]TITLE[picon:123456] BODY2[/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "BODY1[title]TITLE",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 23,
                },
              },
            },
            {
              type: "picon",
              value: "123456",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 23,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 37,
                },
              },
            },
            {
              type: "plain",
              value: " BODY2",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 37,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 43,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("info with title2(broken)", () => {
  let t = new Tokenizer(`[info][title][/title]BODY[/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "[title][/title]BODY",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 25,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("info with title3(broken)", () => {
  let t = new Tokenizer(`[info][title][picon:123456][/title][/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[info][title]",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 13,
        },
      },
    },
    {
      type: "picon",
      value: "123456",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 13,
        },
        end: {
          line: -1,
          column: -1,
          offset: 27,
        },
      },
    },
    {
      type: "plain",
      value: "[/title][/info]",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 27,
        },
        end: {
          line: -1,
          column: -1,
          offset: 42,
        },
      },
    },
  ])
})

test("info with title4(broken)", () => {
  let t = new Tokenizer(`[info]
[title][picon:123456][/title]
[/info]`)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[info]\n[title]",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 14,
        },
      },
    },
    {
      type: "picon",
      value: "123456",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 14,
        },
        end: {
          line: -1,
          column: -1,
          offset: 28,
        },
      },
    },
    {
      type: "plain",
      value: "[/title]\n[/info]",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 28,
        },
        end: {
          line: -1,
          column: -1,
          offset: 44,
        },
      },
    },
  ])
})

test("linkfy", () => {
  let t = new Tokenizer(`url https://example.com`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "url ",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 4,
        },
      },
    },
    {
      type: "link",
      url: "https://example.com",
      children: [
        {
          type: "text",
          value: "https://example.com",
        },
      ],
    },
  ])
})

test("picon", () => {
  let t = new Tokenizer(`[info]hello[picon:123456]world[/info]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
              },
            },
            {
              type: "picon",
              value: "123456",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 25,
                },
              },
            },
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 25,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 30,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("picon in title", () => {
  let t = new Tokenizer(
    `[info][title]hello[picon:123456]world[/title]world[/info]`
  )
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-heading",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 13,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 18,
                },
              },
            },
            {
              type: "picon",
              value: "123456",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 18,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 32,
                },
              },
            },
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 32,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 37,
                },
              },
            },
          ],
        },
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 45,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 50,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("piconname", () => {
  let t = new Tokenizer(`[info]hello[piconname:123456]world[/info]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
              },
            },
            {
              type: "piconname",
              value: "123456",
            },
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 29,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 34,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("piconname in title", () => {
  let t = new Tokenizer(
    `[info][title][piconname:123456]abc[/title]hello[/info]`
  )
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-heading",
          children: [
            {
              type: "piconname",
              value: "123456",
            },
            {
              type: "plain",
              value: "abc",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 31,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 34,
                },
              },
            },
          ],
        },
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 42,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 47,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("To", () => {
  let t = new Tokenizer(`[info]hello[To:123456]world[/info]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
              },
            },
            {
              type: "mension",
              value: "123456",
            },
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 22,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 27,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("Reply", () => {
  let t = new Tokenizer(
    `[info]hello[rp aid=1234567 to=123456789-1234567890123456789]world[/info]`
  )
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
              },
            },
            {
              type: "reply",
              aid: "1234567",
              rid: "123456789",
              mid: "1234567890123456789",
            },
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 60,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 65,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("Reply2", () => {
  let t = new Tokenizer(
    `[info]hello[返信 aid=1234567 to=123456789-1234567890123456789]world[/info]`
  )
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "plain",
              value: "hello",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 6,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 11,
                },
              },
            },
            {
              type: "reply",
              aid: "1234567",
              rid: "123456789",
              mid: "1234567890123456789",
            },
            {
              type: "plain",
              value: "world",
              position: {
                start: {
                  line: -1,
                  column: -1,
                  offset: 60,
                },
                end: {
                  line: -1,
                  column: -1,
                  offset: 65,
                },
              },
            },
          ],
        },
      ],
    },
  ])
})

test("qt", () => {
  let t = new Tokenizer(`[qt][qtmeta aid=1234567 time=1234567890]hello[/qt]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "quote",
      aid: "1234567",
      time: 1234567890,
      children: [
        {
          type: "plain",
          value: "hello",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 40,
            },
            end: {
              line: -1,
              column: -1,
              offset: 45,
            },
          },
        },
      ],
    },
  ])
})

test("qt japanese", () => {
  let t = new Tokenizer(`[引用 aid=1234567 time=1234567890]hello[/引用]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "quote",
      aid: "1234567",
      time: 1234567890,
      children: [
        {
          type: "plain",
          value: "hello",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 32,
            },
            end: {
              line: -1,
              column: -1,
              offset: 37,
            },
          },
        },
      ],
    },
  ])
})

test("qt japanese2", () => {
  let t = new Tokenizer(
    `[引用][qtmeta aid=1234567 time=1234567890]hello[/引用]`
  )
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "quote",
      aid: "1234567",
      time: 1234567890,
      children: [
        {
          type: "plain",
          value: "hello",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 40,
            },
            end: {
              line: -1,
              column: -1,
              offset: 45,
            },
          },
        },
      ],
    },
  ])
})

test("qt mix", () => {
  let t = new Tokenizer(`[引用 aid=1234567 time=1234567890]hello[/qt]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "quote",
      aid: "1234567",
      time: 1234567890,
      children: [
        {
          type: "plain",
          value: "hello",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 32,
            },
            end: {
              line: -1,
              column: -1,
              offset: 37,
            },
          },
        },
      ],
    },
  ])
})

test("qt2", () => {
  let t = new Tokenizer(`[qt][qtmeta aid=1234567 time=1234567890]hello`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[qt][qtmeta aid=1234567 time=1234567890]hello",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 45,
        },
      },
    },
  ])
})

test("info complex broken", () => {
  let t =
    new Tokenizer(`[qt][qtmeta aid=1234567 time=1234567890][title]title[/title]
[info]hello[info]
world[/qt]
`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)

  expect(contents).toEqual([
    {
      type: "quote",
      aid: "1234567",
      time: 1234567890,
      children: [
        {
          type: "plain",
          value: "[title]title[/title]\n[info]hello[info]\nworld",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 40,
            },
            end: {
              line: -1,
              column: -1,
              offset: 84,
            },
          },
        },
      ],
    },
  ])
})

test("info qt complex broken", () => {
  let t = new Tokenizer(`[info][qt][qtmeta aid=1234567 time=1234567890]
hello world[/info]
`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value:
        "[info][qt][qtmeta aid=1234567 time=1234567890]\nhello world[/info]\n",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 66,
        },
      },
    },
  ])
})

test("empty info", () => {
  let t = new Tokenizer(`[info]
[/info]
`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[info]\n[/info]\n",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 15,
        },
      },
    },
  ])
})

test("empty info with title", () => {
  let t = new Tokenizer(`[info]
[title]hello
[/title]
[/info]
`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[info]\n[title]hello\n[/title]\n[/info]\n",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 37,
        },
      },
    },
  ])
})

test("empty info with title2", () => {
  let t = new Tokenizer(`[info]
[title]hello[picon:1234567]world
[/title]
[/info]
`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "[info]\n[title]hello",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 19,
        },
      },
    },
    {
      type: "picon",
      value: "1234567",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 19,
        },
        end: {
          line: -1,
          column: -1,
          offset: 34,
        },
      },
    },
    {
      type: "plain",
      value: "world\n[/title]\n[/info]\n",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 34,
        },
        end: {
          line: -1,
          column: -1,
          offset: 57,
        },
      },
    },
  ])
})

test("linkfy2", () => {
  let t = new Tokenizer(`aaaa
  [hr]
  [qt][qtmeta aid=1234567 time=1234567890][title]タイトル[/title]
  [info]
  hello
  https://example.com/ abc[info]
  dddd[/qt]`)
  t = new LinkifyTokenizer(t)
  let state = new State()
  let contents: Content[] = []
  parse(state, 0, t, "root", contents)
  expect(contents).toEqual([
    {
      type: "plain",
      value: "aaaa\n  ",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 0,
        },
        end: {
          line: -1,
          column: -1,
          offset: 7,
        },
      },
    },
    {
      type: "thematicBreak",
    },
    {
      type: "plain",
      value: "  ",
      position: {
        start: {
          line: -1,
          column: -1,
          offset: 12,
        },
        end: {
          line: -1,
          column: -1,
          offset: 14,
        },
      },
    },
    {
      type: "quote",
      aid: "1234567",
      time: 1234567890,
      children: [
        {
          type: "plain",
          value: "[title]タイトル[/title]\n  [info]\n  hello\n  ",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 54,
            },
            end: {
              line: -1,
              column: -1,
              offset: 93,
            },
          },
        },
        {
          type: "link",
          url: "https://example.com/",
          children: [
            {
              type: "text",
              value: "https://example.com/",
            },
          ],
        },
        {
          type: "plain",
          value: " abc",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 113,
            },
            end: {
              line: -1,
              column: -1,
              offset: 117,
            },
          },
        },
        {
          type: "plain",
          value: "[info]\n  dddd",
          position: {
            start: {
              line: -1,
              column: -1,
              offset: 117,
            },
            end: {
              line: -1,
              column: -1,
              offset: 130,
            },
          },
        },
      ],
    },
  ])
})
