import React from 'react'

import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react'

import { Barang } from '../models'

const CardBarang: React.FC<{
  barang: Barang
}> = (props) => {
  const harga = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  return (
    <IonCard id="open-modal" button={true}>
      <IonCardHeader>
        <IonCardTitle>{props.barang.harga}</IonCardTitle>
        <IonCardSubtitle>{harga(props.barang.harga)}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  )
}

export default CardBarang
