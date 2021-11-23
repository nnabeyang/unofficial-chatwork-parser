import { Processor } from "unified"
import { Data, Node } from "unist"
import parseRoot from "./parser"
import Tokenizer, { LinkifyTokenizer } from "./tokenizer"
import { Content, Root } from "./types/node"

export default function parser(this: Processor): void {
  this.Parser = (text: string): Node<Data> => {
    let t = new Tokenizer(text)
    t = new LinkifyTokenizer(t)
    let contents: Content[] = []
    parseRoot(t, "root", contents)
    const root: Root = {
      type: "root",
      children: contents,
    }
    return root
  }
}
