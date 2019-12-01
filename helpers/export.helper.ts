export const downloadXlsxFile = (
  document: Document,
  data: string,
  name: string
) => {
  const url = window.URL.createObjectURL(new Blob([base64ToArrayBuffer(data)]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${name}.xlsx`) //or any other extension
  document.body.appendChild(link)
  link.click()
}

export const serialize = (value: any) => {
  if (typeof value === 'number') {
    return String(value)
  } else if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }
  return value
}

export const base64ToArrayBuffer = (base64: string) => {
  var binary_string = window.atob(base64)
  var len = binary_string.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}
