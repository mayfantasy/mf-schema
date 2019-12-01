export const dataToTableData = (
  data: Array<{ [key: string]: string }>
): string[][] => {
  const td: string[][] = []
  if (td.length >= 1) {
    td.push(Object.keys(data[0]))

    data.forEach((p) => {
      const pdata: string[] = Object.keys(p).reduce((a: string[], c) => {
        a.push(p[c])
        return a
      }, [])
      td.push(pdata)
    })
  }
  return td
}
