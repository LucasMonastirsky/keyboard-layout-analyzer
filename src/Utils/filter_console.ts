const old_warn = console.warn
console.warn = (...args: any[]) => {
  if (!args.find((x => filter(x))))
    old_warn(...args)
}

const old_error = console.error
console.error = (...args: any[]) => {
  if (!args.find((x => filter(x))))
    old_error(...args)
}

const old_log = console.log
console.log = (...args: any[]) => {
  if (!args.find((x => filter(x))))
    old_log(...args)
}

const filter = (text: string) => blacklist.find(item => text.includes(item))

const blacklist = [
  `React Hook useEffect has a missing dependency: 'keyboard'`,
  `Warning: %s is deprecated in StrictMode. %s was passed an instance of %s`,
]

export {}