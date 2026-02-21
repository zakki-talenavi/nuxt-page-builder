export const filter = (obj: Record<string, any>, validKeys: string[]) => {
  return validKeys.reduce((acc: Record<string, any>, item) => {
    if (typeof obj[item] !== 'undefined') {
      return { ...acc, [item]: obj[item] }
    }
    return acc
  }, {})
}
