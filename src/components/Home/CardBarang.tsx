import {
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
} from '@ionic/react'
import React from 'react'
import { Barang } from '../../models'
import './CardBarang.css'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const CardBarang: React.FC<{
  barang: Barang
  onClick(barang: Barang): void
}> = (props) => {
  const harga = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  return (
    <IonCard
      style={{ width: '100%' }}
      id="open-modal"
      button={true}
      onClick={() => props.onClick(props.barang)}
    >
      <IonItem className="card-barang-item" lines="none">
        <IonAvatar slot="start">
          <img
            src={
              props.barang.gambar
                ? `${BASE_URL}/storage/${props.barang.gambar}`
                : `https://ui-avatars.com/api/?name=${props.barang.nama}`
            }
            alt={props.barang.nama}
          />
        </IonAvatar>
        <IonCardHeader>
          <IonCardTitle>{props.barang.nama}</IonCardTitle>
          <IonCardSubtitle>{harga(props.barang.harga)}</IonCardSubtitle>
        </IonCardHeader>
      </IonItem>
    </IonCard>
  )
}
