import parse from "../src/parser"
import Tokenizer, { LinkifyTokenizer } from "../src/tokenizer"
import { Content } from "../src/types/node"
test("text", () => {
  let t = new Tokenizer(`hello
world`)
  let contents: Content[] = []
  parse(t, "root", contents)

  expect(contents).toEqual([{ type: "text", value: "hello\nworld" }])
})

test("info", () => {
  let t = new Tokenizer(`[info]hello[/info]`)
  let contents: Content[] = []
  parse(t, "root", contents)

  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-body",
          children: [
            {
              type: "text",
              value: "hello",
            },
          ],
        },
      ],
    },
  ])
})

test("info with title", () => {
  let t = new Tokenizer(`[info][title]TITLE[/title]BODY[/info]`)
  let contents: Content[] = []
  parse(t, "root", contents)

  expect(contents).toEqual([
    {
      type: "info",
      children: [
        {
          type: "info-heading",
          children: [
            {
              type: "text",
              value: "TITLE",
            },
          ],
        },
        {
          type: "info-body",
          children: [
            {
              type: "text",
              value: "BODY",
            },
          ],
        },
      ],
    },
  ])
})

test("linkfy", () => {
  let t = new Tokenizer(`url https://example.com`)
  let contents: Content[] = []
  t = new LinkifyTokenizer(t)
  parse(t, "root", contents)
  expect(contents).toEqual([
    {
      type: "text",
      value: "url ",
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
