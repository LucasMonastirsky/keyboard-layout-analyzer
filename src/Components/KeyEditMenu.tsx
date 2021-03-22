import { useEffect, useRef, useState } from 'react'
import { stylesheet } from 'typestyle'
import { Key } from '../Models/Keyboard'
import { colors, defaults } from '../Styling'

const KeyEditMenu = (props: {key_obj: Key, updateKey: (key: Key | null, add_key?: boolean) => void, onClickOutside: ()=>void}) => {
  const [key, setKey] = useState(props.key_obj)
  const menu_ref = useRef<HTMLDivElement>(null)

  //#region Functions
  const changeChar = (index: number, char: string) => {
    const chars = [...key.chars]
    if(chars.length < index) // fill empty chars with ''
      for(let i = chars.length; i < index; i++)
      chars[i] = ''
      chars[index] = char
    key.chars = chars
    setKey(key)
    props.updateKey(key)
  }

  const updateKey = (new_key: Key | null, add_key?: boolean) => {
    if (new_key !== null)
      setKey(new_key)
    props.updateKey(new_key, add_key)
    if(add_key)
      props.onClickOutside()
  }

  const onClickAnywhere = (e: any) => {
    if(menu_ref.current?.contains(e.target) === false) // if the click is outside the menu
      props.onClickOutside()
  }

  useEffect(() => {
    window.addEventListener('mousedown', onClickAnywhere)

    return () => {
      window.removeEventListener('mousedown', onClickAnywhere)
    }
  })
  //#endregion

  return (
    <div className={css.edit_menu} ref={menu_ref}>
      {['KEY', 'SHIFT', 'CTRL', 'ALT', 'FN', 'FN2'].map((x, i) => 
        <Input title={x} content={key.chars[i]} onChange={key => changeChar(i, key)} type="key" />
      )}
      <Input
        title="WIDTH"
        content={props.key_obj.options.w || '1'}
        onChange={width => {key.options.w = width; updateKey(key)}}
        type="numeric"
      />
      <Input
        title="GAP"
        content={props.key_obj.options.x || '0'}
        onChange={gap => {key.options.x = gap; updateKey(key)}}
        type="numeric"
      />
      <div className={css.icon_container}>
        <i onClick={()=>updateKey(null)} className={css.icon + ' fa fa-minus'}></i>
        <i onClick={()=>updateKey(key, true)} className={css.icon + ' fa fa-plus'}></i>
      </div>
    </div>
  )
}

const Input = (props: {title: string, content: string, onChange: (char: string)=>void, type: string}) => {
  const [active, setActive] = useState(false)

  //#region Functions
  const onKeyDown = (e: {key: string}) => {
    if (active && props.type === 'key') {
      props.onChange(validate(e.key))
      setActive(false)
    }
  }

  const onClickAnywhere = () => {
    if(active)
      setActive(false)
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onClickAnywhere)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onClickAnywhere)
    }
  })
  //#endregion

  return (
    <div className={css.line}>
      <div className={css.label}>{props.title}</div>
      <div onClick={()=>setActive(!active)} className={css.input + (active ? ' active' : '')}>
        {props.type === 'key' && <div>{props.content}</div>}
        {props.type === 'numeric' && <input className={css.text_input}
          type="number"
          step="0.25"
          onChange={x => props.onChange(x.target.value)}
          value={props.content} />}
      </div>
    </div>
  )
}

const validate = (key: string) => {
  key = key.toUpperCase()
  if (key === 'CONTROL')
    return 'CTRL'
  if (key === 'BACKSPACE')
    return 'BKS'
  else return key
}

const css = stylesheet({
  edit_menu: {
    boxShadow: defaults.shadow,
    backgroundColor: colors.dark + defaults.transparency,
    color: colors.light,
    borderRadius: 2,
    position: 'absolute',
    top: defaults.key_width,
    marginTop: defaults.margin / 2,
    padding: defaults.margin / 3,
    width: 'max-content',
    zIndex: 3,
  },
  line: {
    display: 'flex',
    padding: defaults.margin / 2,
  },
  label: {
    marginRight: defaults.margin,
  },
  input: {
    borderRadius: 1,
    backgroundColor: colors.gray,
    color: colors.light,
    width: defaults.key_width / 1.5,
    height: 'auto',
    marginLeft: 'auto',
    cursor: 'pointer',
    $nest: {
      '&.active': {
        backgroundColor: colors.light_dark,
        textShadow: '0px 0px 2px black',
      }
    }
  },
  text_input: {
    appearance: 'none',
    backgroundColor: colors.gray,
    color: colors.light,
    borderRadius: 1,
    cursor: 'pointer',
    height: '100%',
    width: defaults.key_width / 1.5,
    marginLeft: 'auto',
    display: 'flex',
    margin: 0,
    padding: 0,
    border: 0,
    outline: 0,
    textAlign: 'end',
  },
  icon_container: {
    backgroundColor: colors.dark + defaults.transparency,
    paddingRight: defaults.margin / 4,
    paddingLeft: defaults.margin / 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    boxShadow: defaults.shadow,
    position: 'absolute',
    bottom: '100%',
    right: defaults.margin / 2,
    $nest: {
      '& > * + *': {
        marginLeft: defaults.margin / 2,
      }
    },
  },
  icon: {
    fontSize: defaults.font_size_big,
    padding: defaults.margin / 3,
    cursor: 'pointer',
  },
})

export default KeyEditMenu