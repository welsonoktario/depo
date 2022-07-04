import { atom } from 'jotai'
import { Transaksi } from '../models'

export const transaksisAtom = atom([] as Transaksi[])
