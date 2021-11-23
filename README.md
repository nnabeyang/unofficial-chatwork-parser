# unofficial-chatwork-parser

unofficial-chatwork-parser is a unified plugin to parse Chatwork message.

# Sample

```ts
import { Options as MdOptions } from "mdast-util-to-hast"
import React from "react"
import compiler from "rehype-react"
import { Options, Root } from "rehype-react/lib"
import mdast2hast from "remark-rehype"
import { Plugin, unified } from "unified"
import parser from "unofficial-chatwork-parser"

import MyLink from "../MyLink"
import { infoBodyHandler, infoHandler, infoHeadingHandler } from "./handlers"

const processor = unified()
  .use(parser)
  .use(mdast2hast, {
    handlers: {
      info: infoHandler,
      "info-heading": infoHeadingHandler,
      "info-body": infoBodyHandler,
    },
  } as MdOptions)
  .use(
    compiler as Plugin<
      [Options],
      Root,
      React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
    >,
    {
      createElement: React.createElement,
      components: {
        a: MyLink,
      },
    } as Options
  )
  .freeze()
```

# License

MIT

# Author

[Noriaki Watanabe@nnabeyang](https://twitter.com/nnabeyang)
