import simulate from '../Utils/simulate'
import { useEffect, useRef, useState } from 'react'
import { default_layouts } from '../Configs'
import { Dropdown } from '../Components'
import { colors, defaults } from '../Styling'
import { Key, Keyboard } from '../Models/Keyboard'
import { stylesheet } from 'typestyle'
import calculateBinds from '../Utils/calculate_binds'
import VisualKey from './VisualKey'
import { createHeatmap } from '../Utils'
import { biggestOf, smallestOf, widthOf } from '../Utils/calc_utils'

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
    if (heatmap_on)
      createHeatmap(keyboard, simulation, heatmap_ref.current!)
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
        pos: keyboard.rows[row_index].keys[key_index].pos
      })

    setKeyboard(calculateBinds(keyboard))
  }

  const swapKeys = (index_1: {row: number, col: number}, index_2: {row: number, col: number}) => {
    if (index_2.row < 0 || index_2.col < 0)
      return

    const key_1 = keyboard.rows[index_1.row].keys[index_1.col]
    const key_2 = keyboard.rows[index_2.row].keys[index_2.col]

    keyboard.rows[index_2.row].keys.splice(index_2.col, 1, key_1)
    keyboard.rows[index_1.row].keys.splice(index_1.col, 1, key_2)

    // re-calculate positions of affected keys
    if (key_1.options.w === key_2.options.w) {
      const p = key_2.pos
      key_2.pos = key_1.pos
      key_1.pos = p
    } else {
      if (index_1.row === index_2.row) {
        for (let i = smallestOf(index_1.col, index_2.col); i <= biggestOf(index_1.col, index_2.col); i++) {
          const key = keyboard.rows[index_1.row].keys[i]
          const prev_key = keyboard.rows[index_1.row].keys[i-1] ?? { pos: { x: 0 }, options: { w: 0 } }
          key.pos.x = prev_key.pos.x + widthOf(prev_key) / 2 + widthOf(key) / 2
        }
      } else {
        [index_1.row, index_2.row].forEach(row_index => {
          keyboard.rows[row_index].keys.forEach((key, key_index) => {
            const prev_key = keyboard.rows[row_index].keys[key_index-1] ?? { pos: { x: 0 }, options: { w: 0 } }
            key.pos.x = prev_key.pos.x + widthOf(prev_key) / 2 + widthOf(key) / 2
          })
        })

        const old_y = key_1.pos.y
        key_1.pos.y = key_2.pos.y
        key_2.pos.y = old_y
      }
    }

    setKeyboard(calculateBinds(keyboard))
  }

  const findIndexes = (x: number, y: number) => {
    const relative = {
      x: x - keyboard_ref.current!.getBoundingClientRect().x,
      y: y - keyboard_ref.current!.getBoundingClientRect().y
    }

    const row_index = Math.floor(relative.y / defaults.key_width)
    if (row_index >= keyboard.rows.length || row_index < 0)
      return { row: -1, col: -1 }

    let key_index = -1
    let distance = 0
    keyboard.rows[row_index].keys.every((key => {
      distance += widthOf(key)
      key_index++
      return (distance < relative.x)
    }))

    return {
      row: row_index,
      col: key_index,
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
                swapWithKey={(x, y) => swapKeys({row: row_index, col: key_index}, findIndexes(x, y))}
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