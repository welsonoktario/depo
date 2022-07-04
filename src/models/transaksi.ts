import { Depo } from './depo'
import { Kurir } from './kurir'

export interface Transaksi {
  id: number
  depo?: Depo
  kurir?: Kurir
}
