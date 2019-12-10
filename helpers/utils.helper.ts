export const enumToKeyArray = <T>(e: T): string[] => {
  let list: string[] = []
  for (let t in e) {
    list.push(t as any)
  }

  return list
}
