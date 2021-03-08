import { useState } from 'react'
import { stylesheet } from 'typestyle'
import { colors, defaults } from '../Styling'

interface IDropdownProps {
  title?: string,
  options: string[],
  onSelect: (value: number) => void,
  style?: {},
}
 
const Dropdown = (props: IDropdownProps) => {
  const [active, setActive] = useState(false)
  const [selection, setSelection] = useState(0)

  const fadeIn = (index: number) => ({
    transition: `opacity ${(active ? (index + 1) : props.options.length - index) * transition_time / props.options.length}s`
     + `, background-color 0.2s`
     + `, visibility ${transition_time}s`,
    opacity: active ? 1 : 0,
    cursor: active ? 'pointer' : 'default', }
  )

  const onClickItem = (index: number) => {
    if (active) {
      setSelection(index)
      props.onSelect(index)
      setActive(false)
    }
  }

  return (
    <div className={css.dropdown_container} style={props.style}>
      <div style={{ display: 'flex' }} onClick={() => setActive(!active)}>
        <div className={css.dropdown_title}>{props.title || props.options[selection]}</div>
        <div className={css.dropdown_arrow + " fa fa-chevron-down"} />
      </div>
      <div className={css.dropdown_item_container} style={{visibility: active ? 'visible' : 'hidden'}}>
        {props.options.map((title, index) =>
          <div className={css.dropdown_item} style={fadeIn(index)} onClick={() => onClickItem(index)} key={index}>
            {title}
          </div>)}
      </div>
    </div>
  )
}

const transition_time: number = 0.75

const css = stylesheet({
  dropdown_container: {
    paddingLeft: defaults.margin,
    paddingRight: defaults.margin,
    fontSize: defaults.font_size_normal,
    cursor: 'pointer',
    position: 'relative',
    width: 'fit-content',
    borderRadius: 3,
    zIndex: 2,
  },
  dropdown_title: {
    color: colors.dark,
    fontWeight: 500,
    fontSize: defaults.font_size_big,
  },
  dropdown_arrow: {
    marginLeft: defaults.margin,
    color: colors.dark,
    alignSelf: 'center',
    fontSize: defaults.font_size_small + 'px !important',
  },
  dropdown_item_container:  {
    boxShadow: defaults.shadow,
    position: 'absolute',
    left: 0,
  },
  dropdown_item: {
    color: colors.light,
    backgroundColor: colors.dark + defaults.transparency,
    paddingLeft: defaults.margin,
    paddingRight: defaults.margin,
    paddingTop: defaults.margin / 4,
    paddingBottom: defaults.margin,
    width: '100%',
    overflow: 'hidden',
    opacity: 0,
    $nest: {
      '&:hover': {
        backgroundColor: colors.dark_light,
      }
    }
  },
})

export default Dropdown