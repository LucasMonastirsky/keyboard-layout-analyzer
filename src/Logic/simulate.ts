import { Keyboard } from '../Models/Keyboard'
import { EmptyKeyData, KeyData, Simulation } from '../Models/Simulation'
import replace_special_chars from '../Utils/replace_special_chars'

const simulate = (keyboard: Keyboard, text: string): Simulation => {
  const simulation: Simulation = { keys: [], total_presses: 0, max_presses: 0 }
  const char_counts: { [char: string]: number } = {}

  for (let row of keyboard.rows)
    for (let key of row.keys)
      simulation.keys[key.id] = EmptyKeyData()

  // count the amount of each character and the total
  let caps_lock: boolean = false
  const text_split = text.split('')
  text_split.forEach((char, index) => {
    if (caps_lock && /[a-z]/.test(char)) {
      char_counts['CAPS'] = (char_counts['CAPS'] || 0) + 1
      caps_lock = false
    }
    else if (!caps_lock && /[A-Z]/.test(char)) { 
      if (/[A-Z]/.test(text_split[index + 1]) && keyboard.modifiers['CAPS'].length > 0) { // if the next char is upper case, press CAPS
        char_counts['CAPS'] = (char_counts['CAPS'] || 0) + 1
        caps_lock = true
      }
      else char_counts['SHIFT'] = (char_counts['SHIFT'] || 0) + 1 // else press SHIFT
    }

    char = replace_special_chars(char)
    char = char.toUpperCase()
    char_counts[char] = (char_counts[char] ?? 0) + 1
    simulation.total_presses++
  })

  const modifier_ids: {[index: string]: string} = {}
  Object.keys(keyboard.modifiers).forEach(key => {
    keyboard.modifiers[key].forEach(id => {
      modifier_ids[id] = key.toLowerCase()
    })
  })

  // add press to each key in each char's binds
  Object.keys(char_counts).forEach(char => {
    if (['CAPS', 'SHIFT'].includes(char))
      simulation.keys[keyboard.modifiers[char][0]].presses += char_counts[char]
    else if (!keyboard.binds[char])
      console.warn(`char ${char} not found on this keyboard`)
    else keyboard.binds[char][0].forEach(key => {
      simulation.keys[key].presses += char_counts[char]

      if (Object.keys(modifier_ids).includes(`${key}`)) { // if the key was pressed with a modifier, add it to its data
        simulation.keys[keyboard.binds[char][0][0]][modifier_ids[key] as keyof KeyData] += char_counts[char]
      }

      if (simulation.keys[key].presses > simulation.max_presses) // store the highest amount of presses
        simulation.max_presses = simulation.keys[key].presses
    })
  })

  // calculate data for each key
  simulation.keys.forEach(key => {
    key.heat = key.presses / simulation.max_presses
    key.percentage = Math.round(key.presses / simulation.total_presses * 100)
  })

  return simulation
}

export default simulate
