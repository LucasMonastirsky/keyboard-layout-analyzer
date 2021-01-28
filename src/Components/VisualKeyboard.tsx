import React from 'react'
import { Keyboard, Row, Key } from '../Models/Keyboard'
import { ISimulation } from '../Utils/simulate'
import { heatToColor } from '../Utils/color_manipulation'
import { stylesheet } from 'typestyle'
import { colors } from '../Styling'

export default function VisualKeyboard(props: {layout: Keyboard, simulation: ISimulation}): JSX.Element {
  return (
  <div className={css.keyboard}>
    {props.layout.rows.map((row, index) => <VisualRow row={row} simulation={props.simulation} key={`row${index}`}/>)}
  </div>
  )
}

const VisualRow = (props: {row: Row, simulation: ISimulation }) =>
  <div className={css.row}>
    {props.row.keys.map((key, index) => {
      let heat = 0;
      if (props.simulation.heatmap[key.id] !== undefined)
        heat = props.simulation.heatmap[key.id] / props.simulation.max_heat
      return <VisualKey key_obj={key} heat={heat} key={index} />
    })}
  </div>

const VisualKey = (props: { key_obj: Key, heat: number, }) =>
  <div className={css.key_slot} style={{
      width: `${(+props.key_obj.options.w || 1) * key_width}px`,
      marginLeft: (+props.key_obj.options.x || 0) * key_width,
      height: key_width}}>
    <div className={css.key} style={{backgroundColor: heatToColor(props.heat || 0) }}>
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
  </div>

// STYLES

const key_width = 80 // px
const key_cell_center_size = 50 // %
const key_legend_ratio = 1.9
const font_big = 30
const font_small = 20

const css = stylesheet({
  keyboard: {
    display: 'grid',
  },
  row: {
  
  },
  key_slot: {
    float: 'left',
    display: 'flex',
  },
  key: {
    backgroundColor: colors.keycap,
    flex: 'auto',
    borderRadius: '5px',
    border: '1px solid black',
    padding: '5px',
    margin: '0.5px',
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
    fontSize: font_big / key_legend_ratio,
  }
})
