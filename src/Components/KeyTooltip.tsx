import { stylesheet } from "typestyle"
import { KeyData } from "../Models/Simulation"
import { colors, defaults } from "../Styling"

const KeyTooltip = (props: {active: boolean, pos: { y: number, x: number }, data: KeyData }) => {
  return (
    <div className={css.container} style={{top: props.pos.y, left: props.pos.x, display: props.active ? 'block' : 'none' }}>
      <Line label="Keystrokes" value={props.data.presses} />
      <Line label="Percentage" value={props.data.percentage + '%'} />
      <Line label="Heat" value={Math.round(props.data.heat * 100) + '%'} />
      {['Shift', 'Alt', 'Ctrl', 'Fn', 'Fn2'].map(modifier => {
        const count = props.data[modifier.toLowerCase() as keyof KeyData]
        return count > 0
          ? <Line label={modifier} value={Math.round(count / props.data.presses * 100) + '%'} />
          : null
      })}
    </div>
  )
}

const Line = (props: { label: string, value: any}) =>
  <div className={css.line}>
    <div className={css.label}>{props.label}: </div>
    <div className={css.value}>{props.value}</div>
  </div>

const css = stylesheet({
  container: {
    backgroundColor: colors.dark_light + defaults.transparency,
    color: colors.light,
    padding: defaults.margin / 2,
    borderRadius: 2,
    boxShadow: defaults.shadow,
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 2,
  },
  line: {
    display: 'flex',
  },
  label: {
    marginRight: defaults.margin,
  },
  value: {
    marginLeft: 'auto',
  },
})

export default KeyTooltip