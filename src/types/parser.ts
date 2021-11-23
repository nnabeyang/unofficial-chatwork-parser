import { Content } from "./node"
import { ITokenizer } from "./token"

export type ParentType = "root" | "info" | "thematicBreak"
export type parse = (
  t: ITokenizer,
  parentType: string,
  contents: Content[]
) => void
export interface IStateBlock {
  parentType: ParentType
  prevType: string
  force: Boolean
  offset: number
  src: string
  line: number
  bMarks: number[]
  push(node: Content): void
  peek(): Content | null
  parseInfo(src: string): Content[]
}
