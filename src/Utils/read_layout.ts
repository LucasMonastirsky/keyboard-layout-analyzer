import { Keyboard, Row, Key } from '../Models/Keyboard'
import validateChar, { modifiers } from './validate_char'
import calculateBinds from './calculate_binds'

const readLayout = (layout: string, name?: string): Keyboard => {
  const keyboard: Keyboard = {
    name: name || 'Untitled Keyboard',
    binds: {},
    rows: [],
    modifiers: {
      SHIFT: [],
      CTRL: [],
      ALT: [],
      FN: [],
      FN2: [],
      CAPS: [],
    }
  }

  // this could technically be faster by iterating only once per character using a buffer
  // but the performance improvement would not be noticeable, and this is more readable
  
  let count: number = 0

  // get rows and keys
  layout.split('\n').forEach(line => {
    const result_row: Row = { keys: [] }
    line.split('|').forEach(key => {
      const result_key: Key = { id: count, chars: [], options: {} }
      const split = key.split(' ') // split into chars and options

      // chars
      split[0].split(',').forEach(char => {
        if (modifiers.includes(char)) {
          if (keyboard.modifiers[char] === undefined)
            keyboard.modifiers[char] = []
          keyboard.modifiers[char].push(count)
        }
        result_key.chars.push(validateChar(char))
      })

      // key options
      if (split.length > 1) {
        split[1].split(',').forEach(option => {
          const options = option.split(':')
          result_key.options[options[0]] = options[1] })
      }

      result_row.keys.push(result_key)
      ++count
    })
    keyboard.rows.push(result_row)
  })

  // calculate binds for each possible character
  return calculateBinds(keyboard)
}

export default readLayout