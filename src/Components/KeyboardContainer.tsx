import simulate from '../Utils/simulate'
import { useEffect, useRef, useState } from 'react'
import { default_layouts } from '../Configs'
import { Dropdown } from '../Components'
import { colors, defaults } from '../Styling'
import { Key, Keyboard } from '../Models/Keyboard'
import { stylesheet } from 'typestyle'
import calculateBinds from '../Utils/calculate_binds'
import VisualKey from './VisualKey'
import h337 from 'heatmap.js'

// config
const HEATMAP_FILLING = true
const HEATMAP_FILLING_RATIO = 1
const HEATMAP_FILLING_AVERAGE = false

interface IKeyboardContainerProps {
  text: string,
  keyboard: Keyboard,
  onRemove: () => void,
  onAdd: () => void
  onChangeKeyboard: (keyboard: Keyboard) => void, 
  remove_disabled?: boolean,
}
const KeyboardContainer = (props: IKeyboardContainerProps) => {
  const [keyboard, _setKeyboard] = useState(props.keyboard)
  const [simulation, setSimulation] = useState(simulate(keyboard, props.text))
  const [heatmap_on, setHeatmapOn] = useState(false)
  useEffect(()=>{_setKeyboard(props.keyboard)}, [props.keyboard])
  useEffect(()=>{setSimulation(simulate(keyboard, props.text))}, [props.text])
  const keyboard_ref = useRef<HTMLDivElement>(null)
  const heatmap_ref = useRef<HTMLDivElement>(null)

  const setKeyboard = (new_keyboard: Keyboard) => {
    _setKeyboard(new_keyboard)
    setSimulation(simulate(new_keyboard, props.text))
    props.onChangeKeyboard(new_keyboard)
  }

  // create heatmap
  useEffect(() => {
    const heatmap = h337.create({
      container: heatmap_ref.current!,
      radius: 80,
      // blur: 0,
      maxOpacity: 0.5,
      minOpacity: 0,
    })


    const data: {x: number, y: number, value: number}[] = []
    keyboard.rows.forEach((row, row_index) => {
      row.keys.forEach((key, key_index) => {
        const key_sim = simulation.keys[key.id]
        if (key_sim.presses > 0) {
          data.push({...key.pos, value: key_sim.heat})

          // fill horizontal gap between this key and the one before
          if (HEATMAP_FILLING) {
            const prev_key = row.keys[key_index - 1]
            const prev_key_sim = simulation.keys[prev_key?.id]
            if (prev_key_sim?.presses > 0) 
              data.push({
                x: prev_key.pos.x + (key.pos.x - prev_key.pos.x) / 2,
                y: key.pos.y,
                value: HEATMAP_FILLING_AVERAGE
                  ? (key_sim.heat + prev_key_sim.heat) / 2 / HEATMAP_FILLING_RATIO
                  : key_sim.heat > prev_key_sim.heat ? prev_key_sim.heat : key_sim.heat
              })

            const width = defaults.key_width * +(key.options.w ?? 1)
            if (row_index > 0) {
              for (let i = 0; i < keyboard.rows[row_index - 1].keys.length; i++) {
                const key_above = keyboard.rows[row_index - 1].keys[i]
                if (Math.abs(key.pos.x - key_above.pos.x) < width && simulation.keys[key_above.id].presses > 0) {console.log(key.chars[0], key_above.chars[0])
                  data.push({
                    x: (key.pos.x + key_above.pos.x) / 2,
                    y: (key.pos.y + key_above.pos.y) / 2,
                    value: HEATMAP_FILLING_AVERAGE
                      ? (key_sim.heat + simulation.keys[i].heat) / 2 / HEATMAP_FILLING_RATIO
                      : key_sim.heat > simulation.keys[key_above.id].heat ? simulation.keys[key_above.id].heat : key_sim.heat
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

    return () => { // cleanup
      heatmap_ref.current?.removeChild(heatmap_ref.current?.firstChild!)
    }
  })

  //#region Functions
  const lastOf = (arr: any[]) => arr[arr.length-1]
  const updateKey = (row_index: number, key_index: number, key: Key | null, add_key?: boolean) => {
    if (key === null)
      keyboard.rows[row_index].keys.splice(key_index, 1)
    else
      keyboard.rows[row_index].keys[key_index] = key
    if (add_key)
      keyboard.rows[row_index].keys.splice(key_index, 0, {
        id: lastOf(lastOf(keyboard.rows).keys).id + 1,
        chars: Array(5).fill(''),
        options: {},
        pos: { x: 0, y: 0 }
      })

    setKeyboard(calculateBinds(keyboard))
  }

  const swapKeys = (pos_1: {x: number, y: number}, pos_2: {x: number, y: number}) => {
    if (pos_2.x < 0 || pos_2.y < 0)
      return

    const key_1 = keyboard.rows[pos_1.x].keys[pos_1.y]
    const key_2 = keyboard.rows[pos_2.x].keys[pos_2.y]

    const old_pos = key_1.pos
    key_1.pos = key_2.pos
    key_2.pos = old_pos

    keyboard.rows[pos_2.x].keys.splice(pos_2.y, 1, key_1)
    keyboard.rows[pos_1.x].keys.splice(pos_1.y, 1, key_2)
    setKeyboard(calculateBinds(keyboard))
  }

  const findIndexes = (x: number, y: number) => {
    const relative = {
      x: x - keyboard_ref.current!.getBoundingClientRect().x,
      y: y - keyboard_ref.current!.getBoundingClientRect().y
    }

    const row_index = Math.floor(relative.y / defaults.key_width)
    if (row_index >= keyboard.rows.length || row_index < 0)
      return { x: -1, y: -1 }

    let key_index = -1
    let distance = 0
    keyboard.rows[row_index].keys.every((key => {
      distance += defaults.key_width * (+key.options.w || 1)
      key_index++
      return (distance < relative.x)
    }))

    return {
      x: row_index,
      y: key_index,
    }
  }
  //#endregion

  return (
    <div className={css.keyboard_container}>
      <div className={css.header}>
        <div style={{flex: 1}}>
          <div className={css.header_text} onClick={() => setHeatmapOn(!heatmap_on)}>Heatmap: {heatmap_on ? 'On' :  'Off'}</div>
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Dropdown
            title={keyboard.name}
            options={default_layouts.map(layout => layout.name)}
            onSelect={selection => setKeyboard(default_layouts[selection])}
          />
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div onClick={props.onRemove} className={css.icon + " fa fa-minus"} style={{visibility: props.remove_disabled ? 'hidden' : 'visible'}}/>
          <div onClick={props.onAdd} className={css.icon + " fa fa-plus"} />
        </div>
      </div>
      <div className={css.keyboard} ref={keyboard_ref}>
        <div className={css.heatmap_container} style={{opacity: heatmap_on ? 1 : 0}} ref={heatmap_ref}></div>
        {keyboard.rows.map((row, row_index) =>
          <div className={css.row} key={row_index}>
            {row.keys.map((key, key_index) => 
              <VisualKey
                key={`${key_index}`}
                key_obj={key}
                key_data={simulation.keys[key.id]}
                heat_enabled={!heatmap_on}
                updateKey={(key: Key | null, add_key?: boolean) => {updateKey(row_index, key_index, key, add_key)}}
                swapWithKey={(x, y) => swapKeys({x: row_index, y: key_index}, findIndexes(x, y))}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const css = stylesheet({
  keyboard_container: {
    marginTop: defaults.margin,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'fit-content',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: defaults.margin
  },
  header_text: {
    fontSize: defaults.font_size_big,
    fontWeight: 500,
    color: colors.dark,
    textAlign: 'left',
    marginLeft: defaults.margin,
    cursor: 'pointer',
    width: 'fit-content',
    paddingLeft: defaults.margin,
    paddingRight: defaults.margin,
  },
  icon: {
    marginRight: defaults.margin * 2,
    fontSize: defaults.font_size_big + 'px !important',
    cursor: 'pointer',
  },
  keyboard: {
    display: 'grid',
    position: 'relative',
  },
  heatmap_container: {
    zIndex: 1,
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    transition: `opacity ${defaults.transition_time * 2}s`,
    //@ts-ignore
    position: 'absolute !important',
  },
  row: {
  
  },
})

export default KeyboardContainer