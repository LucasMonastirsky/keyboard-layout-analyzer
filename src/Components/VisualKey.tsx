import { useRef, useState } from 'react'
import { Key } from '../Models/Keyboard'
import { heatToColor } from '../Utils/color_manipulation'
import { stylesheet } from 'typestyle'
import { colors, defaults } from '../Styling'
import KeyEditMenu from './KeyEditMenu'
import KeyTooltip from './KeyTooltip'
import Draggable from 'react-draggable'
import { KeyData } from '../Models/Simulation'
import { widthOf } from '../Utils/calc_utils'

interface IVisualKeyProps {
  key_obj: Key,
  key_data: KeyData,
  heat_enabled?: boolean,
  updateKey: (key: Key | null, add_key?: boolean) => void,
  swapWithKey: (x: number, y: number) => void
}


const VisualKey = (props: IVisualKeyProps) => {
  const [editting, setEditting] = useState(false)
  const [is_dragging, setDragging] = useState(false)
  const [click_timestamp, setClickTimestamp] = useState(0)
  const [tooltip_active, setTooltipActive] = useState(false)
  const [mouse_pos, setMousePos] = useState({x: 0, y: 0})
  const [hovering, setHovering] = useState(false)
  
  const hovering_ref = useRef(hovering)
  hovering_ref.current = hovering
  const editting_ref = useRef(editting)
  editting_ref.current = editting

  const ref = useRef<HTMLDivElement>(null)

  //#region Functions
  const click_events = {
    onMouseDown: () => {
      setClickTimestamp(editting ? 0 : Date.now())
    },

    onMouseUp: () => {
      if (editting || is_dragging || Date.now() - click_timestamp > 300)
        return
      else {
        setEditting(true)
        setTooltipActive(false)
      }
    },
  }

  const drag_events = {
    onDrag: () => {
      if (editting || Date.now() - click_timestamp < 50) {
        setDragging(false)
      }
      else {
        setDragging(true)
        setClickTimestamp(0)
      }
    },
    onStop: (e: any) => {
      setDragging(false)
      props.swapWithKey(e.x, e.y)
    }
  }

  const hover_events = {
    onMouseEnter: (e: any) => {
      delayTooltip()
      setHovering(true)
    },
    onMouseLeave: (e: any) => {
      setHovering(false)
      setTooltipActive(false)
    },
    onMouseMove: (e: any ) => {
      if (!editting)
        setMousePos({x: e.clientX + 15, y: e.clientY + 5})
      setTooltipActive(false)
      delayTooltip()
    }
  }

  const delayTooltip = () => {
    setTimeout(() => {
      if (hovering_ref.current && !editting_ref.current)
        setTooltipActive(true)
    }, 500)
  }
  //#endregion
  const key_style = {
    backgroundColor: (props.heat_enabled ?? true)
      ? heatToColor(props.key_data.heat)
      : colors.keycap,
    zIndex: is_dragging ? 2 : 0
  }

  return (
      <div ref={ref} className={css.key_slot} {...click_events} style={{
        width: widthOf(props.key_obj),
        marginLeft: +(props.key_obj.options.x ?? 0) * defaults.key_width, }}>
        <Draggable bounds={is_dragging ? false : {top: 0, right: 0, left: 0, bottom: 0}} position={{x:0, y: 0}} {...drag_events}>
          <div className={css.key} style={key_style} {...hover_events}>
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
        </Draggable>
        {editting && <KeyEditMenu
          key_obj={props.key_obj}
          mouse_pos={mouse_pos}
          updateKey={props.updateKey}
          onClickOutside={() => setEditting(false)}
        />}
        <KeyTooltip active={tooltip_active} pos={mouse_pos} data={props.key_data} />
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
    userSelect: 'none',
  },
  key: {
    backgroundColor: colors.keycap,
    flex: 'auto',
    borderRadius: '5px',
    border: '1px solid black',
    padding: '5px',
    margin: '0.5px',
    cursor: 'pointer',
    transition: `background-color ${defaults.transition_time}s`
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
