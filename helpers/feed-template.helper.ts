export const parseMustache = (str: string, obj: any) => {
  return str.replace(/{{\s*([\w\.]+)\s*}}/g, function(tag, match) {
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

export const detectFirstRow = (data: string[][]): number | null => {
  let index: number | null = null
  data.forEach((row, ri) => {
    row.forEach((item) => {
      if (item.indexOf('{{') !== -1) {
        index = ri
      }
    })
  })
  return index
}
