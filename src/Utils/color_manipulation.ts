const heatToColor = (heat: number) => {
  const bias = (255 * (1 - heat))
  return `rgb(255, ${bias}, ${bias})`
}

export { heatToColor }