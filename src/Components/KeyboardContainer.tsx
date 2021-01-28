import simulate, { ISimulation } from '../Utils/simulate'
import VisualKeyboard from './VisualKeyboard'
import { useState } from 'react'
import readLayout from '../Utils/read_layout'
import { default_layouts } from '../Configs'
import { Dropdown } from '../Components'
import { defaults } from '../Styling'
import { stylesheet } from 'typestyle'

interface IKeyboardContainerProps {
  text: string,
  layout: string,
  onRemove: () => void,
  onAdd: () => void
  onChangeLayout: (layout: string) => void,
}
const KeyboardContainer = (props: IKeyboardContainerProps) => {
  const layouts = Object.keys(default_layouts).map(key => ({ id: key, title: key }))
  const layout = readLayout(props.layout)

  return (
    <div className={css.keyboard_container}>
      <div className={css.keyboard_header}>
        <div style={{flex: 1}} />
        <div style={{flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Dropdown options={layouts} onSelect={selection => props.onChangeLayout(default_layouts[selection])}/>
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div onClick={props.onRemove} className={css.keyboard_icon + " fa fa-minus"} />
          <div onClick={props.onAdd} className={css.keyboard_icon + " fa fa-plus"} />
        </div>
      </div>
      <VisualKeyboard layout={layout} simulation={simulate(layout, props.text)} />
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