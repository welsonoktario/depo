import { CapacitorHttp as Http } from '@capacitor/core'
import { Dialog } from '@capacitor/dialog'
import {
  IonModalCustomEvent,
  modalController,
  OverlayEventDetail,
} from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import { useAtomValue } from 'jotai'
import { LngLat } from 'mapbox-gl'
import { FC, useState } from 'react'
import { authAtom } from '../../atoms'
import { ModalPilihLokasi } from '../Keranjang/ModalPilihLokasi'

const BASE_URL = process.env.REACT_APP_API_URL

export const ModalTambahAlamat: FC = () => {
  const auth = useAtomValue(authAtom)
  const [nama, setNama] = useState('')
  const [alamat, setAlamat] = useState('')
  const [lokasi, setLokasi] = useState({ lat: 0, lng: 0 })
  const [isUtama, setIsUtama] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const cancel = async () => {
    await modalController.dismiss(undefined)
  }

  const tambah = async () => {
    const res = await Http.post({
      url: BASE_URL + '/alamat',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        nama,
        alamat,
        lokasi,
        isUtama,
      },
    })

    const { data, status } = res

    if (status !== 500) {
      await modalController.dismiss(data.data)
    } else {
      await Dialog.alert({
        title: 'Error',
        message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
      })
    }
  }

  const closeModal = (
    e: IonModalCustomEvent<
      OverlayEventDetail<{
        lokasi: LngLat
        alamat: string
      }>
    >
  ) => {
    setIsOpen(false)
    const data = e.detail.data

    if (data) {
      setLokasi(data.lokasi)
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => cancel()}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Tambah Alamat</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset lines="none">
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Nama</IonLabel>
            <IonInput
              type="text"
              placeholder="Nama"
              autocomplete="name"
              onIonChange={(e) => setNama(e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Alamat</IonLabel>
            <IonInput
              type="text"
              placeholder="Alamat"
              autocomplete="address-line1"
              onIonChange={(e) => setAlamat(e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset">
            <IonLabel>Jadikan Alamat Utama</IonLabel>
            <IonToggle
              slot="end"
              onIonChange={(e) => setIsUtama(e.detail.checked)}
            />
          </IonItem>
          <IonItem lines="none" onClick={() => setIsOpen(true)} button detail>
            <IonLabel>
              {lokasi.lat !== 0 ? 'Ubah Titik Lokasi' : 'Pilih Titik Lokasi'}
            </IonLabel>
          </IonItem>
        </IonList>

        <IonModal isOpen={isOpen} onDidDismiss={closeModal}>
          <ModalPilihLokasi />
        </IonModal>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" onClick={() => tambah()}>
          Tambah
        </IonButton>
      </IonFooter>
    </>
  )
}
