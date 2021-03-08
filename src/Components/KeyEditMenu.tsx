import { useEffect, useRef, useState } from 'react'
import { stylesheet } from 'typestyle'
import { Key } from '../Models/Keyboard'
import { colors, defaults } from '../Styling'

const KeyEditMenu = (props: {key_obj: Key, updateKey: (key: Key) => void, onClickOutside: ()=>void}) => {
  const [key, setKey] = useState(props.key_obj)

  const menu_ref = useRef<HTMLDivElement>(null)

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

  const updateKey = (new_key: Key) => {
    setKey(new_key)
    props.updateKey(new_key)
  }

  const onClickAnywhere = (e: any) => {
    if(menu_ref.current?.contains(e.target) === false) // if the click is outside the menu
      props.onClickOutside()
  }

  useEffect(() => {
    window.addEventListener('click', onClickAnywhere)

    return () => {
      window.removeEventListener('click', onClickAnywhere)
    }
  })

  return (
    <div className={css.edit_menu} ref={menu_ref}>
      {['KEY', 'SHIFT', 'CTRL', 'ALT', 'FN', 'FN2'].map((x, i) => 
        <Input title={x} content={key.chars[i]} onChange={key => changeChar(i, key)} type="key" />
      )}
      <Input
        title="WIDTH"
        content={props.key_obj.options.w || `${1}`}
        onChange={width => {key.options.w = width; updateKey(key)}}
        type="numberic" />
    </div>
  )
}

const Input = (props: {title: string, content: string, onChange: (char: string)=>void, type: string}) => {
  const [active, setActive] = useState(false)

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
    window.addEventListener('click', onClickAnywhere)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('click', onClickAnywhere)
    }
  })

  return (
    <div className={css.line}>
      <div className={css.label}>{props.title}</div>
      <div onClick={()=>setActive(!active)} className={css.input + (active ? ' active' : '')}>
        {props.type === 'key' && <div>{props.content}</div>}
        {props.type === 'numberic' && <input className={css.text_input}
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
    width: 'max-content',
    height: 200,
    zIndex: 1,
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
})

export default KeyEditMenu