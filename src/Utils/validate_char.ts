const validateChar = (char: string): string => {
  if (char === 'COMMA')
    return ','
  if (char === 'BAR')
    return '|'
  if (char === ''
  || char.length === 1
  || special_chars.includes(char))
    return char
  else throw new Error(`Invalid character: ${char}`)
}

const special_chars: string[] = [
  'TAB','CAPS','SHIFT','CTRL','ALT','ENTER','SPACE','OS','OPT','FN','FN2','ESC','BKS',
  'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
  'MISC'
]

const modifiers: string[] = [
  'SHIFT','CTRL','ALT','FN','FN2','CAPS'
]

export default validateChar
export { modifiers }