import { Keyboard } from '../Models/Keyboard'
import { Simulation } from '../Models/Simulation'
import h337 from 'heatmap.js'
import { average, smallestOf, widthOf } from '../Utils/calc_utils'

// config
const HEATMAP_FILLING = true
const HEATMAP_FILLING_AVERAGE = false
const HEATMAP_FILLING_RATIO = 1.5

const createHeatmap = (keyboard: Keyboard, simulation: Simulation, container: HTMLElement) => {
  if (container.firstChild)
        container.removeChild(container.firstChild)

  const heatmap = h337.create({
    container,
    radius: 80,
    maxOpacity: 0.5,
    minOpacity: 0,
    // blur: 0,
  })

  const data: {x: number, y: number, value: number}[] = []
  keyboard.rows.forEach((row, row_index) => {
    row.keys.forEach((key, key_index) => {
      const key_sim = simulation.keys[key.id]
      if (key_sim.presses > 0) {
        data.push({...key.pos, value: key_sim.heat})

        if (HEATMAP_FILLING) { // fill horizontal gap between this key and the one before
          const prev_key = row.keys[key_index - 1]
          const prev_key_sim = simulation.keys[prev_key?.id]
          if (prev_key_sim?.presses > 0) {
            data.push({
              x: prev_key.pos.x + (key.pos.x - prev_key.pos.x) / 2,
              y: key.pos.y,
              value: HEATMAP_FILLING_AVERAGE
                ? average(key_sim.heat, prev_key_sim.heat) / HEATMAP_FILLING_RATIO
                : smallestOf(key_sim.heat, prev_key_sim.heat) / HEATMAP_FILLING_RATIO
            })
          }

          // fill vertical gap between this key and keys above it that are near
          const width = widthOf(key)
          if (row_index > 0) {
            for (let i = 0; i < keyboard.rows[row_index - 1].keys.length; i++) {
              const key_above = keyboard.rows[row_index - 1].keys[i]
              const distance = key_above.pos.x - key.pos.x

              if (distance > width / 2)
                break;

              if (Math.abs(distance) < width / 2 && simulation.keys[key_above.id].presses > 0) {
                data.push({
                  x: average(key.pos.x, key_above.pos.x),
                  y: average(key.pos.y, key_above.pos.y),
                  value: HEATMAP_FILLING_AVERAGE
                    ? average(key_sim.heat, simulation.keys[i].heat) / HEATMAP_FILLING_RATIO
                    : smallestOf(key_sim.heat, simulation.keys[key_above.id].heat) / HEATMAP_FILLING_RATIO
                })
              }
            }
          }
        }
      }
    })
  })

  heatmap.setData({
    max: 0.45,
    min: 0,
    data: data,
  })
}

export default createHeatmap