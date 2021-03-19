import simulate from '../Utils/simulate'
import { useEffect, useRef, useState } from 'react'
import { default_layouts } from '../Configs'
import { Dropdown } from '../Components'
import { defaults } from '../Styling'
import { Key, Keyboard } from '../Models/Keyboard'
import { stylesheet } from 'typestyle'
import calculateBinds from '../Utils/calculate_binds'
import VisualKey from './VisualKey'

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
  useEffect(()=>{_setKeyboard(props.keyboard)}, [props.keyboard])
  useEffect(()=>{setSimulation(simulate(keyboard, props.text))}, [props.text])
  const keyboard_ref = useRef<HTMLDivElement>(null)

  const setKeyboard = (new_keyboard: Keyboard) => {
    _setKeyboard(new_keyboard)
    setSimulation(simulate(new_keyboard, props.text))
    props.onChangeKeyboard(new_keyboard)
  }

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
        options: {}})

    setKeyboard(calculateBinds(keyboard))
    setSimulation(simulate(keyboard, props.text))
  }

  const swapKeys = (pos_1: {x: number, y: number}, pos_2: {x: number, y: number}) => {
    if (pos_2.x < 0 || pos_2.y < 0)
      return
    const key_2 = keyboard.rows[pos_2.x].keys.splice(pos_2.y, 1, keyboard.rows[pos_1.x].keys[pos_1.y])[0]
    keyboard.rows[pos_1.x].keys.splice(pos_1.y, 1, key_2)
    setKeyboard(keyboard)
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
        <div style={{flex: 1}} />
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
        {keyboard.rows.map((row, row_index) =>
          <div className={css.row} key={row_index}>
            {row.keys.map((key, key_index) => 
              <VisualKey
                key={`${key_index}`}
                key_obj={key}
                key_data={simulation.keys[key.id]}
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
  icon: {
    marginRight: defaults.margin * 2,
    fontSize: defaults.font_size_big + 'px !important',
    cursor: 'pointer',
  },
  keyboard: {
    display: 'grid',
  },
  row: {
  
  },
})

export default KeyboardContainer