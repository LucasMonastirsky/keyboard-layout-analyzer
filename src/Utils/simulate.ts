import { Keyboard } from '../Models/Keyboard'
import replace_special_chars from './replace_special_chars'

const simulate = (keyboard: Keyboard, text: string): ISimulation => {
  const simulation: ISimulation = { heatmap: {}, total_heat: 0, max_heat: 0 }
  const char_counts: { [char: string]: number } = {}

  // count the amount of each character and the total
  let caps_lock: boolean = false
  const text_split = text.split('')
  text_split.forEach((char, index) => {
    if (caps_lock && /[a-z]/.test(char)) {
      char_counts['CAPS'] = (char_counts['CAPS'] || 0) + 1
      caps_lock = false
    }
    else if (!caps_lock && /[A-Z]/.test(char)) { 
      if (/[A-Z]/.test(text_split[index + 1])) { // if the next char is upper case, press CAPS
        char_counts['CAPS'] = (char_counts['CAPS'] || 0) + 1
        caps_lock = true
      }
      else char_counts['SHIFT'] = (char_counts['SHIFT'] || 0) + 1 // else press SHIFT
    }

    char = replace_special_chars(char)
    char = char.toUpperCase()
    char_counts[char] = (char_counts[char] || 0) + 1
    simulation.total_heat++
  })

  // add heat to each key in each char's binds
  Object.keys(char_counts).forEach(char => {
    if (['CAPS', 'SHIFT'].includes(char))
      simulation.heatmap[keyboard.modifiers[char][0]] = (simulation.heatmap[keyboard.modifiers[char][0]] || 0) + char_counts[char]
    else if (!keyboard.binds[char])
      console.warn(`char ${char} not found on this keyboard`)
    else keyboard.binds[char][0].forEach(key => {
      simulation.heatmap[key] = (simulation.heatmap[key] || 0) + char_counts[char]
      if (simulation.heatmap[key] > simulation.max_heat)
        simulation.max_heat = simulation.heatmap[key]
    })
  })

  return simulation
}

/** Contains data about a specific keyboard's
 * effectiveness on a specific text.
 * 
 * 'heat' represents an amount of keypresses
 */
interface ISimulation {
  /** indexed by key id, contains the heat for each key */
  heatmap: { [index: number]: number },
  /** combined heat of all keys */
  total_heat: number,
  /** the highest heat value amongst all keys */
  max_heat: number,
}

export type { ISimulation } 
export default simulate
