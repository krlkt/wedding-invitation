export const createQueryString = (name: string, value: string) => {
  if (!name) throw new Error('searchParam name cant be empty')
  const params = new URLSearchParams()
  if (value !== '') params.set(name, value)

  return value === '' ? name : params.toString()
}
