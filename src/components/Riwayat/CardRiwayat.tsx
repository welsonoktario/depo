import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonNote,
} from '@ionic/react'
import React from 'react'
import { Transaksi } from '../../models'

export const CardRiwayat: React.FC<{
  transaksi: Transaksi
  onClick: (transaksi: Transaksi) => void
}> = (props) => {
  const tanggal = new Date(props.transaksi.tanggal).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const statusColor = () => {
    let color = 'tertiary'
    const status = props.transaksi.status
    if (status === 'Menunggu Pembayaran') {
      color = 'warning'
    } else if (status === 'Selesai') {
      color = 'success'
    }

    return color
  }

  return (
    <IonCard button onClick={() => props.onClick(props.transaksi)}>
      <IonItem lines="none">
        <IonCardHeader>
          <IonCardTitle>Transaksi #{props.transaksi.id}</IonCardTitle>
          <IonCardSubtitle>{tanggal}</IonCardSubtitle>
        </IonCardHeader>

        <IonNote slot="end" color={statusColor()}>
          {props.transaksi.status}
        </IonNote>
      </IonItem>
    </IonCard>
  )
}
