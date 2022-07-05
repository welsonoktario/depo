import { atom } from 'jotai'
import { User } from '../models'

export const authAtom = atom({
  user: null,
  token: '',
} as {
  user: User | null
  token: string
})
