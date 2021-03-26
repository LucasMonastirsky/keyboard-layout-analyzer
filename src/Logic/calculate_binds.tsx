import { Keyboard } from "../Models/Keyboard"
import { modifiers } from '../Utils/validate_char'

const calculateBinds = (keyboard: Keyboard) => {
  keyboard.binds = {}
  const modifier_order = ['SHIFT', 'CTRL', 'ALT', 'FN', 'FN2']
  keyboard.rows.forEach(row => {
    row.keys.forEach(key => {
      if(!modifiers.includes(key.chars[0])){
        push([key.id], keyboard.binds, key.chars[0])
        if (key.chars.length > 1) {
          for(let i = 1; i < key.chars.length; ++i) {
            if (key.chars[i] !== "") {
              const modifier = keyboard.modifiers[modifier_order[i-1]][0]
              push([key.id, modifier], keyboard.binds, key.chars[i])
            }
          }
        }
      }
    })
  })
  return keyboard
}

const push = (value: any, dictionary: { [index: string]: any[] }, key: string): void => {
  if (dictionary[key] === undefined)
    dictionary[key] = [value]
  else dictionary[key].push(value)
}

export default calculateBinds