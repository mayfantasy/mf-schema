export const enumToKeyArray = <T>(e: T): string[] => {
  let list: string[] = []
  for (let t in e) {
    list.push(t as any)
  }

  return list
}

export const isEmptyObject = (obj: any) => {
  return (
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  )
}
