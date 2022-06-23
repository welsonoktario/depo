import { useAtom } from "jotai"
import React from "react"

import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from "@ionic/react"

import { cartAtom } from "../atoms"
import { Barang } from "../models"

const CardBarang: React.FC<Barang> = (props) => {
  const [cart, setCart] = useAtom(cartAtom)
  const harga = (harga: number) => `Rp ${harga.toLocaleString('id-ID')}`

  const addToCart = (barang: Barang, jumlah: number) => {
    const exist = cart.findIndex((item) => item.barang.id == barang.id)

    if (exist != -1) {
      const newCart = [...cart]
      newCart[exist].jumlah += jumlah
      setCart(newCart)
    } else {
      setCart([...cart, { barang, jumlah }])
    }
  }

  return (
    <IonCard button={true} onClick={() => addToCart(props, 2)}>
      <IonCardHeader>
        <IonCardTitle>{props.nama}</IonCardTitle>
        <IonCardSubtitle>{harga(props.harga)}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  )
}

export default CardBarang
