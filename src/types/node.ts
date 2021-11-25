import {
  ListContent,
  Literal,
  PhrasingContent,
  RowContent,
  TableContent,
  TopLevelContent,
} from "mdast"
import { Node, Parent as UnistParent } from "unist"

export type Content =
  | TopLevelContent
  | ListContent
  | TableContent
  | RowContent
  | PhrasingContent
  | Info
  | InfoHeading
  | InfoBody
  | PIcon
  | PIconName
  | Mension
  | Reply
  | Quote
  | Plain

export interface Parent extends UnistParent {
  children: Content[]
}
export interface Root extends Parent {
  type: "root"
}
export interface Info extends Parent {
  type: "info"
}
export interface InfoHeading extends Parent {
  type: "info-heading"
}
export interface InfoBody extends Parent {
  type: "info-body"
}
export interface PIcon extends Literal {
  type: "picon"
}
export interface PIconName extends Literal {
  type: "piconname"
}
export interface Mension extends Literal {
  type: "mension"
}

export interface Plain extends Literal {
  type: "plain"
}

export interface Reply extends Node {
  type: "reply"
  aid: string
  rid: string
  mid: string
}

export interface Quote extends Parent {
  type: "quote"
  aid: string
  time: number
}
