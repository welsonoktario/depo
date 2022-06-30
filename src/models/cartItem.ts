import { Barang } from './barang'
import { Kategori } from './kategori'

export interface CartItem {
  barang: Barang
  jumlah: number
  kategori?: Kategori
}
