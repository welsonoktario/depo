import { Barang } from './barang'

export interface Kategori {
  id: number
  nama: string
  barangs: Barang[]
}
