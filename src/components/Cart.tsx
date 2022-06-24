import { useAtom } from 'jotai'
import React from 'react'
import { IonButton } from '@ionic/react'

import { authAtom, cartAtom } from '../atoms'
import { Http } from '@capacitor-community/http'

const Cart: React.FC = () => {
  const [auth] = useAtom(authAtom)
  const [cart, setCart] = useAtom(cartAtom)

  const checkout = async () => {
    const res = await Http.post({
      url: process.env.REACT_APP_BASE_URL + '/transaksi',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      data: {
        cart,
        user: (auth.user as any).id,
      },
    })

    const { data } = await res.data
    console.log(data)
    setCart([])
  }

  return (
    <>
      {cart.map((item, index) => (
        <p key={index}>
          {item.barang.nama}: <span>{item.jumlah}</span>
        </p>
      ))}
      <IonButton expand='block' onClick={checkout}>
        Checkout
      </IonButton>
    </>
  )
}

export default Cart
