import { Key } from '../Models/Keyboard'
import { defaults } from '../Styling'

const smallestOf = (num1: number, num2: number) => num1 > num2 ? num2 : num1
const biggestOf = (num1: number, num2: number) => num1 > num2 ? num1 : num2
const average = (num1: number, num2: number) => (num1 + num2) / 2

const widthOf = (key: Key) => defaults.key_width * +(key.options.w ?? 1)

export { smallestOf, biggestOf, average, widthOf }