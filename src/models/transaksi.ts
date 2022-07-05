import { Depo } from './depo'
import { Kurir } from './kurir'
import { TransaksiDetail } from './transaksiDetail'

export interface Transaksi {
  id: number
  tanggal: string
  status: string
  depo?: Depo
  kurir?: Kurir
  details: TransaksiDetail[]
}
