import { LngLat } from 'mapbox-gl'

export interface Alamat {
  id: number
  nama: string
  alamat: string
  lokasi: LngLat
  isUtama: boolean
}
