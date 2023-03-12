const randomHexColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16)

  return `#${n.slice(0, 6).toUpperCase()}`
}

const toTitleCase = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`

export { randomHexColor, toTitleCase }
