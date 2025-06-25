export interface User {
  id: number
  email_id: number
  username_id: number
  password: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export type LoggedInUser = Omit<User, 'password'>
