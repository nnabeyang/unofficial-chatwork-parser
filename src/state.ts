import { IState, ParentType } from "./types/parser"
import { TokenType } from "./types/token"
class State implements IState {
  parents: ParentType[]
  constructor() {
    this.parents = []
  }
  valid(level: number): boolean {
    return this.parents.length === level
  }
  push(parent: ParentType): void {
    this.parents.push(parent)
  }

  contains(parent: ParentType, type: TokenType): boolean {
    const n = this.parents.length
    for (let i = n - 1; i >= 0; i--) {
      if (this.parents[i] === parent) {
        switch (parent) {
          case "info":
            if (type !== "info_close") {
              return false
            }
            break
          case "quote":
            if (type !== "quote_close") {
              return false
            }
            break
          case "title":
            if (type !== "title_close") {
              return false
            }
            break
          case "root":
            return false
          default:
            const _exhaustiveCheck: never = parent
        }
        this.parents = this.parents.slice(0, i + 1)
        return true
      }
    }
    return false
  }

  pop(): ParentType | undefined {
    return this.parents.pop()
  }
}
export default State
