import { LngLat } from 'mapbox-gl'
import { Depo } from './depo'
import { Kurir } from './kurir'
import { TransaksiDetail } from './transaksiDetail'

export interface Transaksi {
  id: number
  tanggal: string
  status: string
  depo?: Depo
  kurir?: Kurir
  lokasiPengiriman: LngLat
  buktiPembayaran?: string
  ulasan?: string
  details: TransaksiDetail[]
}
