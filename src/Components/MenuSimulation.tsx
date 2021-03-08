import { useState } from 'react'
import { stylesheet } from 'typestyle'
import { colors, defaults } from '../Styling'
import { default_texts } from '../Configs'

const MenuSimulation = (props: { onSubmitText(text: string): void } ) => {
  const [text, setText] = useState("")

  const onClickSubmit = (_text?: string) => {
    props.onSubmitText(_text || text)
  }

  const setDefault = (_text: string) => {
    setText(_text)
    onClickSubmit(_text)
  }

  return (
    <div className={css.input_menu}>
      <textarea className={css.simulation_text_input} onChange={e => setText(e.target.value)} value={text} />
      <div className={css.input_menu_button_container}>
        <div className={css.simulation_button} onClick={() => onClickSubmit()}><p>SUBMIT</p></div>
        <div className={css.button_title}><p style={{margin: 0}}>DEFAULTS</p></div>
        <div className={css.simulation_button} onClick={() => setDefault(default_texts.twitter)}><p>TWEETS</p></div>
        <div className={css.simulation_button} onClick={() => setDefault(default_texts.javascript)}><p>JAVASCRIPT</p></div>
        <div className={css.simulation_button} onClick={() => setDefault(default_texts.books)}><p>BOOKS</p></div>
      </div>
    </div>
  )
} 

const css = stylesheet({
  simulation_menu_container: {
    overflow: 'hidden',
    width: '100%',
    bottom: 0,
    marginTop: 'auto',
  },
  simulation_menu: {
    backgroundColor: colors.dark,
    marginTop: 'auto',
    padding: defaults.margin,
    fontFamily: defaults.font,
    position: 'relative',
    transition: `top ${defaults.transition_time * 2}s`, 
    top: 0,
    $nest: {
      '&.hidden': {
        top: `calc(100% - ${defaults.font_size_big * 2}px)`
      }
    }
  },
  simulation_menu_title_container: {
    display: 'flex',
    marginBottom: defaults.margin,
    color: colors.light,
  },
  simulation_menu_title: {
    fontSize: defaults.font_size_big,
  },
  simulation_close_icon: {
    marginLeft: 'auto',
    marginRight: defaults.margin,
    fontSize: `${defaults.font_size_big}px !important`,
    cursor: 'pointer',
  },
  simulation_menu_hide_button: {
    marginLeft: 'auto',
  },
  input_menu: {
    flexGrow: 1,
    display: 'flex',
    height: 'fit-content',
  },
  simulation_text_input: {
    resize: 'none',
    flex: 1,
    marginRight: defaults.margin,
    borderRadius: 5,
    backgroundColor: colors.light,
  },
  input_menu_button_container: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: defaults.margin,
    paddingRight: defaults.margin,
  },
  simulation_button: {
    height: 'fit-content',
    width: '100%',
    alignSelf: 'center',
    fontSize: defaults.font_size_big,
    color: colors.light,
    backgroundColor: colors.dark,
    borderWidth: 0,
    borderColor: colors.light_dark,
    borderRadius: 3,
    padding: defaults.margin / 2,
    borderStyle: 'solid',
    transition: defaults.transition_time + 's',
    cursor: 'pointer', 
    $nest: {
      '&:hover': {
        backgroundColor: colors.dark_light,
      },
      '&:focus': {
        color: 'red',
      },
      'p': {
        margin: 0,
      }
    }
  },
  button_title: {
    color: colors.light_dark,
    fontSize: defaults.font_size_big,
    borderTop: '0px solid',
    borderBottom: '1px solid',
    textAlign: 'center',
    paddingTop: defaults.margin / 2,
    paddingBottom: defaults.margin / 2,
    marginRight: defaults.margin,
    marginLeft: defaults.margin,
  },
})

export default MenuSimulation