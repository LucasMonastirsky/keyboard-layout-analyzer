import { useState } from 'react'
import { stylesheet } from 'typestyle'
import { defaults, colors } from '../Styling'

const MultiMenu = (props: {menus: { title: string, content: any }[]}) => {
  const [active, setActive] = useState(true)
  const [index, setIndex] = useState(0)

  const toggleActive = () => setActive(!active)

  return (
    <div className={css.container} style={{ position: active ? 'inherit' : 'unset' }}>
      <div className={css.content + (active ? '' : ' hidden')}>
        <div className={css.header}>
          {props.menus.map((menu, menu_index) =>
            <div
              className={css.menu_title + (index === menu_index ? ' active' : '')}
              onClick={() => setIndex(menu_index)}
              key={menu_index}>
              {menu.title}
            </div>
          )}
          <i onClick={toggleActive} className={css.close_icon + ` fa fa-chevron-${active ? 'down' : 'up'}`} />
        </div>
        <div className={css.menu_container} style={{display: active ? 'inherit' : 'none'}}>
          <div className={css.menu}>{props.menus[index].content}</div>
        </div>
      </div>
    </div>
  )
}

const css = stylesheet({
  container: {
    overflow: 'hidden',
    width: '100%',
    bottom: 0,
    marginTop: 'auto',
    zIndex: 2,
  },
  content: {
    backgroundColor: colors.dark,
    marginTop: 'auto',
    padding: defaults.margin,
    paddingTop: 0,
    fontFamily: defaults.font,
    position: 'relative',
    transition: `top ${defaults.transition_time * 2}s`, 
    top: 0,
    $nest: {
      '&.hidden': {
        top: `calc(100% - ${defaults.font_size_big * 2 - defaults.margin / 1.5}px)`
      }
    }
  },
  header: {
    display: 'flex',
    color: colors.light,
  },
  close_icon: {
    marginLeft: 'auto',
    marginRight: defaults.margin,
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: `${defaults.font_size_big}px !important`,
    cursor: 'pointer',
  },
  menu_title: {
    alignSelf: 'center',
    fontSize: defaults.font_size_big,
    padding: defaults.margin / 1.5,
    cursor: 'pointer',
    borderRadius: 1,
    transition: `background-color ${defaults.transition_time}s`,
    $nest: {
      '&:hover': {
        backgroundColor: colors.light_dark,
      },
      '&.active': {
        backgroundColor: colors.dark_light,
        fontSize: defaults.font_size_big + 1,
        fontWeight: 400,
      },
    }
  },
  menu_container: {

  },
  menu: {

  },
})

export default MultiMenu