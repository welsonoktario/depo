import { useAtom } from "jotai"
import React from "react"

import { cartAtom } from "../atoms"

const Cart: React.FC = () => {
  const [cart] = useAtom(cartAtom)

  return (
    <>
      {cart.map((item, index) => (
        <p key={index}>
          {item.barang.nama}: <span>{item.jumlah}</span>
        </p>
      ))}
    </>
  )
}

export default Cart
