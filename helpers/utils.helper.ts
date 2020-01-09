export const enumToKeyArray = <T>(e: T): string[] => {
  let list: string[] = []
  for (let t in e) {
    list.push(t as any)
  }

  return list
}

export const handleRxp = /^[a-z0-9\-]+$/i

export const parseMustache = (str: string, obj: any) => {
  return str.replace(/{{\s*([\w\.]+)\s*}}/g, (tag, match) => {
    const nodes = match.split('.')
    let current = obj
    const length = nodes.length
    let i = 0
    while (i < length) {
      try {
        current = current[nodes[i]]
      } catch (e) {
        return ''
      }
      i++
    }
    return current
  })
}
