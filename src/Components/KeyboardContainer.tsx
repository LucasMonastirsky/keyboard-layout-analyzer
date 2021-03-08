import simulate from '../Utils/simulate'
import VisualKeyboard from './VisualKeyboard'
import { useEffect, useState } from 'react'
import { default_layouts } from '../Configs'
import { Dropdown } from '../Components'
import { defaults } from '../Styling'
import { Key, Keyboard } from '../Models/Keyboard'
import { stylesheet } from 'typestyle'
import calculateBinds from '../Utils/calculate_binds'

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

  const updateKey = (row_index: number, key_index: number, key: Key) => {
    keyboard.rows[row_index].keys[key_index] = key
    setKeyboard(calculateBinds(keyboard))
    setSimulation(simulate(keyboard, props.text))
  }

  return (
    <div className={css.keyboard_container}>
      <div className={css.keyboard_header}>
        <div style={{flex: 1}} />
        <div style={{flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Dropdown
            title={keyboard.name}
            options={default_layouts.map(layout => layout.name)}
            onSelect={selection => setKeyboard(default_layouts[selection])}
          />
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div onClick={props.onRemove} className={css.keyboard_icon + " fa fa-minus"} style={{visibility: props.remove_disabled ? 'hidden' : 'visible'}}/>
          <div onClick={props.onAdd} className={css.keyboard_icon + " fa fa-plus"} />
        </div>
      </div>
      <VisualKeyboard keyboard={keyboard} simulation={simulation} updateKey={updateKey} />
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
  keyboard_header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: defaults.margin
  },
  keyboard_icon: {
    marginRight: defaults.margin * 2,
    fontSize: defaults.font_size_big + 'px !important',
    $nest: {
      '&:hover': {
        cursor: 'pointer',
      }
    }
  }
})

export default KeyboardContainer