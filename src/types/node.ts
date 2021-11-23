import {
  ListContent,
  PhrasingContent,
  RowContent,
  TableContent,
  TopLevelContent,
} from "mdast"
import { Parent as UnistParent } from "unist"

export type Content =
  | TopLevelContent
  | ListContent
  | TableContent
  | RowContent
  | PhrasingContent
  | Info
  | InfoHeading
  | InfoBody

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
