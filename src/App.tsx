import React, { useState } from 'react'
import { HeaderBar, KeyboardContainer, SimulationInputMenu } from './Components'
import { style, stylesheet } from 'typestyle'
import { default_layouts } from './Configs'

function App() {
  const [simulation_text, setSimulationText] = useState("")
  const [keyboards, setKeyboards] = useState([{ layout: default_layouts.qwerty_sixty_percent }])

  const onSubmitText = (text: string) => {
    setSimulationText(text)
  }

  const onAddKeyboard = (index: number) => {
    const new_keyboards = keyboards
    new_keyboards.splice(index + 1, 0, { layout: default_layouts.qwerty_sixty_percent })
    setKeyboards([...new_keyboards])
  }

  const onRemoveKeyboard = (index: number) => {
    if (keyboards.length < 2)
      return
    const new_keyboards = keyboards
    new_keyboards.splice(index, 1)
    setKeyboards([...new_keyboards])
  }

  const onChangeLayout = (index: number, layout: string) => {
    const new_keyboards = keyboards
    new_keyboards.splice(index, 1, { layout })
    setKeyboards([...new_keyboards])
  }

  return (
    <div className={css.app}>
      <HeaderBar />
      <div className={css.content}>
        {keyboards.map((keyboard, index) => <KeyboardContainer
          text={simulation_text}
          layout={keyboard.layout}
          onChangeLayout={(layout: string) => onChangeLayout(index, layout)}
          onRemove={() => onRemoveKeyboard(index)}
          onAdd={() => onAddKeyboard(index)} />)}
      </div>
      <SimulationInputMenu onSubmitText={onSubmitText} />
    </div>
  )
}

const css = stylesheet({
  app: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    marginLeft: 'auto',
    marginRight: 'auto',
  }
})

export default App

const style_app = 'app ' + style({
  
})

const style_keyboard_container = 'keyboard_container ' + style({
  display: 'inline-block',
  alignSelf: 'center',
})