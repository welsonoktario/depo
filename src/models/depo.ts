export interface Depo {
  id: number
  nama: string,
  alamat: string,
  tipeCabang: string,
  lokasi: {
    lat: number,
    long: number
  }
}