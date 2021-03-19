/** Contains data about a specific keyboard's
 * effectiveness on a specific text.
 * 
 * 'heat' represents an amount of keypresses
 */
type Simulation = {
  /** indexed by key id */
  keys: KeyData[],
  /** combined presses of all keys */
  total_presses: number,
  /** the highest heat value amongst all keys */
  max_presses: number,
}

type KeyData = {
  presses: number,
  heat: number,
  percentage: number,
  shift: number,
  ctrl: number,
  alt: number,
  fn: number,
  fn2: number,
}

const EmptyKeyData = () => ({
  presses: 0,
  heat: 0,
  percentage: 0,
  shift: 0,
  ctrl: 0,
  alt: 0,
  fn: 0,
  fn2: 0,
})

export type { Simulation, KeyData }
export { EmptyKeyData }