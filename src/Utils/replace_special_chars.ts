const replace_special_chars = (char: string) => {
  switch(char) {
    case " ":
      return "SPACE"
    default:
      return char
  }
}

export default replace_special_chars