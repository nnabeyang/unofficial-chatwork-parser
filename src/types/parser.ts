import { Content } from "./node"
import { ITokenizer, TokenType } from "./token"

export type ParentType = "root" | "info" | "quote" | "title"
export type parse = (
  state: IState,
  level: number,
  t: ITokenizer,
  parentType: ParentType,
  contents: Content[]
) => void

export interface IState {
  parents: ParentType[]
  push(parent: ParentType): void
  contains(parent: ParentType, type: TokenType): boolean
  valid(level: number): boolean
  pop(): ParentType | undefined
}
