import simulate from '../Utils/simulate'
import { useEffect, useState } from 'react'
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

  const setKeyboard = (new_keyboard: Keyboard) => {
    _setKeyboard(new_keyboard)
    setSimulation(simulate(new_keyboard, props.text))
    props.onChangeKeyboard(new_keyboard)
  }

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
      <div className={css.keyboard}>
        {keyboard.rows.map((row, row_index) =>
          <div className={css.row} key={row_index}>
            {row.keys.map((key, key_index) => 
              <VisualKey
                key={`${key_index}`}
                key_obj={key}
                heat={(simulation.heatmap[key.id] ?? 0) / simulation.max_heat}
                updateKey={(key: Key | null, add_key?: boolean) => {updateKey(row_index, key_index, key, add_key)}}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const lastOf = (arr: any[]) => arr[arr.length-1]

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