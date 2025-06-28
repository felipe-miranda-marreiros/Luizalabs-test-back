export interface User {
  id: number
  email: string
  password: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export type PartialUser = Omit<User, 'password'>
