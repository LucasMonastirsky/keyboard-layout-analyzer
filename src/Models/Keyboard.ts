type Layout = {
  name: string,
  data: string
}

type Keyboard = {
  name: string,
  binds: {
    /** Indexed by char. Each char contains every combination of
     * binds that outputs that char.
     */
    [char: string]: number[][]
  }
  modifiers: { [key: string]: number[]}
  rows: Row[]
}

type Row = { keys: Key[] }

type Key = {
  id: number
  chars: string[]
  options: KeyOptions
}

type KeyOptions = {
  [key: string]: string
}

export type { Layout, Keyboard, Row, Key, KeyOptions }