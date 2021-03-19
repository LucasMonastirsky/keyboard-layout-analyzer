import React, { useState } from 'react'
import { HeaderBar, KeyboardContainer } from './Components'
import { Keyboard } from './Models/Keyboard'
import { stylesheet } from 'typestyle'
import { default_layouts } from './Configs'
import MultiMenu from './Components/MultiMenu'
import MenuSimulation from './Components/MenuSimulation'

function App() {
  const [simulation_text, setSimulationText] = useState("")
  const [keyboards, setKeyboards] = useState([default_layouts[0]])

  //#region Functions
  const onSubmitText = (text: string) => {
    setSimulationText(text)
  }

  const onAddKeyboard = (index: number) => {
    const new_keyboards = keyboards
    new_keyboards.splice(index + 1, 0, default_layouts[0])
    setKeyboards([...new_keyboards])
  }

  const onRemoveKeyboard = (index: number) => {
    const new_keyboards = keyboards
    new_keyboards.splice(index, 1)
    setKeyboards([...new_keyboards])
    console.log(new_keyboards)
  }

  const onChangeKeyboard = (index: number, keyboard: Keyboard) => {
    const new_keyboards = keyboards
    new_keyboards.splice(index, 1, keyboard)
    setKeyboards([...new_keyboards])
  }
  //#endregion

  return (
    <div className={css.app}>
      <HeaderBar />
      <div className={css.content}>
        {keyboards.map((keyboard, index) => <KeyboardContainer
          text={simulation_text}
          keyboard={keyboard}
          onChangeKeyboard={keyboard => onChangeKeyboard(index, keyboard)}
          onRemove={() => onRemoveKeyboard(index)}
          onAdd={() => onAddKeyboard(index)}
          remove_disabled={keyboards.length === 1}
          key={index}
        />)}
      </div>
      <MultiMenu menus={[
        {title: 'SIMULATION', content: <MenuSimulation onSubmitText={onSubmitText} />},
      ]} />
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
