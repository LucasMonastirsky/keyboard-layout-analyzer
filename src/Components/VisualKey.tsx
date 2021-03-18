import React, { useState } from 'react'
import { Key } from '../Models/Keyboard'
import { heatToColor } from '../Utils/color_manipulation'
import { stylesheet } from 'typestyle'
import { colors, defaults } from '../Styling'
import KeyEditMenu from './KeyEditMenu'

const VisualKey = (props: { key_obj: Key, key: string, heat: number, updateKey: (key: Key | null, add_key?: boolean)=>void }) => {
  const [editting, setEditting] = useState(false)

  return (
    <div className={css.key_slot}
      style={{
        width: `${(+props.key_obj.options.w || 1) * defaults.key_width}px`,
        marginLeft: (+props.key_obj.options.x || 0) * defaults.key_width, }}>
      <div className={css.key} style={{backgroundColor: heatToColor(props.heat || 0) }} onClick={() => setEditting(!editting)}>
        <div className={css.key_cell_top}>
          <div className={css.key_legend_top}>{props.key_obj.chars[4] || ""}</div>
          <div className={css.key_legend_top_second}>{props.key_obj.chars[5] || ""}</div>
        </div>
        <div className={css.key_cell_center}>
          <div className={css.key_legend_center} style={{fontSize: props.key_obj.chars[0].length > 1 ? font_small : font_big }}>
            {props.key_obj.chars[0] || ""}
          </div>
        </div>
        <div className={css.key_cell_bottom}>
          <div className={css.key_legend_bottom}>{props.key_obj.chars[1] || ""}</div>
          <div className={css.key_legend_bottom}>{props.key_obj.chars[2] || ""}</div>
          <div className={css.key_legend_bottom}>{props.key_obj.chars[3] || ""}</div>
        </div>
      </div>
      {editting && <KeyEditMenu
        key_obj={props.key_obj}
        updateKey={props.updateKey}
        onClickOutside={() => setEditting(false)} />}
    </div>
  )
}

// STYLES

const key_cell_center_size = 50 // %
const key_legend_ratio = 1.9
const font_big = 30
const font_small = 20

const css = stylesheet({
  key_slot: {
    float: 'left',
    display: 'flex',
    position: 'relative',
    height: defaults.key_width,
  },
  key: {
    backgroundColor: colors.keycap,
    flex: 'auto',
    borderRadius: '5px',
    border: '1px solid black',
    padding: '5px',
    margin: '0.5px',
    cursor: 'pointer',
  },
  key_text: {
      margin: 'auto',
  },
  key_cell_top: {
    display: 'flex',
    height: (100 - key_cell_center_size) / 2 + '%',
  },
  key_legend_top: {
    textAlign: 'left',
    fontSize: font_big / key_legend_ratio,
  },
  key_legend_top_second: {
    textAlign: 'right',
    flex: 'auto',
  },
  key_cell_center: {
    height: key_cell_center_size + '%',
  },
  key_legend_center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  key_cell_bottom: {
    height: (100 - key_cell_center_size) / 2 + '%',
    width: '100%',
    display: 'inline-block',
  },
  key_legend_bottom: {
    float: 'left',
    width: '33.33%',
    height: 1,
    fontSize: font_big / key_legend_ratio,
  }
})

export default VisualKey
