import { Http } from '@capacitor-community/http'
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
import { Alamat } from '../../models'
import { ModalPilihAlamat } from '../Keranjang/ModalPilihAlamat'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const ModalEditAlamat: FC<{ alamat: Alamat }> = ({ alamat }) => {
  const auth = useAtomValue(authAtom)
  const [nama, setNama] = useState(alamat.nama)
  const [namaAlamat, setNamaAlamat] = useState(alamat.alamat)
  const [lokasi, setLokasi] = useState(alamat.lokasi)
  const [isUtama, setIsUtama] = useState(alamat.isUtama)
  const [isOpen, setIsOpen] = useState(false)

  const cancel = async () => {
    await modalController.dismiss(undefined)
  }

  const edit = async () => {
    const res = await Http.patch({
      url: BASE_URL + '/alamat/' + alamat.id,
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        nama,
        alamat: namaAlamat,
        lokasi,
        isUtama,
      },
    })

    const { data, status } = res

    if (status !== 500) {
      await modalController.dismiss({
        id: alamat.id,
        nama,
        alamat: namaAlamat,
        lokasi,
        isUtama,
      })
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
          <IonTitle>Edit Alamat</IonTitle>
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
              value={nama}
              onIonChange={(e) => setNama(e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Alamat</IonLabel>
            <IonInput
              type="text"
              placeholder="Alamat"
              autocomplete="address-line1"
              value={namaAlamat}
              onIonChange={(e) => setNamaAlamat(e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset">
            <IonLabel>Jadikan Alamat Utama</IonLabel>
            <IonToggle
              slot="end"
              checked={isUtama}
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
          <ModalPilihAlamat />
        </IonModal>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" onClick={() => edit()}>
          Ubah
        </IonButton>
      </IonFooter>
    </>
  )
}
