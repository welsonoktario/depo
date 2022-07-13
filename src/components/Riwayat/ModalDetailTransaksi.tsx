import { Dialog } from '@capacitor/dialog'
import { modalController } from '@ionic/core'
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import {
  calendarOutline,
  carOutline,
  close as closeIcon,
  homeOutline,
  qrCodeOutline,
  timeOutline,
} from 'ionicons/icons'
import React from 'react'
import { Transaksi } from '../../models'

export const ModalDetailTransaksi: React.FC<{ transaksi: Transaksi }> = (
  props
) => {
  const transaksi = props.transaksi
  const tanggal = new Date(transaksi.tanggal).toLocaleString('id-ID', {
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

  const total = transaksi.details.reduce(
    (prev, next) => prev + next.jumlah * next.barang.harga,
    0
  )

  const details = transaksi.details.map((detail, index) => (
    <IonItem key={index}>
      <div className="flex-col" style={{ width: '100%' }}>
        <div className="flex-row justify-between items-center">
          <IonLabel>{detail.barang.nama}</IonLabel>
          <IonBadge>
            x{detail.jumlah} @{' '}
            {'Rp ' + detail.barang.harga.toLocaleString('id-ID')}
          </IonBadge>
        </div>
        <div className="flex-row justify-end">
          <p>
            {'Rp ' +
              (detail.jumlah * detail.barang.harga).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </IonItem>
  ))

  const close = async () => {
    await modalController.dismiss()
  }

  const showPembayaran = async () => {
    await Dialog.alert({
      title: 'Pembayaran',
      message: `Transfer sebesar Rp ${total.toLocaleString(
        'id-ID'
      )} transaksi ke rekening BCA Amadis dengan nomor rekening 7807807880`,
    })
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={close}>
              <IonIcon slot="icon-only" icon={closeIcon}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Detail Transaksi</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset>
          <IonItemGroup>
            <IonListHeader>
              <IonText>
                <h5>Detail</h5>
              </IonText>
            </IonListHeader>
            <IonItem>
              <IonIcon
                icon={qrCodeOutline}
                style={{ paddingRight: '8px' }}
              ></IonIcon>
              <IonLabel>ID Transaksi</IonLabel>
              <IonLabel slot="end">{transaksi.id}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon
                icon={calendarOutline}
                style={{ paddingRight: '8px' }}
              ></IonIcon>
              <IonLabel>Tanggal Transaksi</IonLabel>
              <IonLabel slot="end">{tanggal}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon
                icon={homeOutline}
                style={{ paddingRight: '8px' }}
              ></IonIcon>
              <IonLabel>Depo</IonLabel>
              <IonLabel slot="end">{transaksi.depo?.nama}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon
                icon={carOutline}
                style={{ paddingRight: '8px' }}
              ></IonIcon>
              <IonLabel>Kurir</IonLabel>
              <IonLabel slot="end">{transaksi.kurir?.user.nama}</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonIcon
                icon={timeOutline}
                style={{ paddingRight: '8px' }}
              ></IonIcon>
              <IonLabel>Status</IonLabel>
              <IonLabel slot="end" color={statusColor()}>
                {transaksi.status}
              </IonLabel>
            </IonItem>
          </IonItemGroup>

          <IonItemGroup>
            <IonListHeader style={{ paddingBottom: '8px' }}>
              <IonText>
                <h5>Barang</h5>
              </IonText>
            </IonListHeader>

            {details}
          </IonItemGroup>
        </IonList>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonItem lines="none" className="ion-margin-bottom">
          <IonLabel>Total</IonLabel>
          <IonNote slot="end" color="primary">
            Rp {total.toLocaleString('id-ID')}
          </IonNote>
        </IonItem>

        {transaksi.status === 'Menunggu Pembayaran' ? (
          <IonButton onClick={showPembayaran} expand="block" fill="clear">
            Petunjuk Pembayaran
          </IonButton>
        ) : null}
      </IonFooter>
    </>
  )
}
