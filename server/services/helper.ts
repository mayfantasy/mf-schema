export const getAccountProfileData = (data: any) => {
  const accountData = { ...data }

  delete accountData.db_key
  delete accountData.api_key
  delete accountData.account_id
  delete accountData.password

  return accountData
}

export const getAccountNoPassData = (data: any) => {
  const accountData = { ...data }

  delete accountData.password

  return accountData
}
