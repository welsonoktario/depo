import { CapacitorHttp as Http } from '@capacitor/core'
import { Dialog } from '@capacitor/dialog'
import { Preferences } from '@capacitor/preferences'
import { modalController } from '@ionic/core'
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
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { close as closeIcon } from 'ionicons/icons'
import { useAtom } from 'jotai'
import { FC, useRef } from 'react'
import { authAtom } from '../../atoms'
import { User } from '../../models'

const BASE_URL = process.env.REACT_APP_API_URL

export const ModalUbahProfil: FC = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const nama = useRef(auth.user?.nama)
  const telepon = useRef(auth.user?.telepon)
  const email = useRef(auth.user?.email)

  const ubah = async () => {
    const res = await Http.patch({
      url: BASE_URL + '/auth/' + auth.user?.id,
      data: {
        nama: nama.current,
        telepon: telepon.current,
        email: email.current,
      },
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const { data, status } = res

    if (status !== 500) {
      const oldAuth = JSON.parse(JSON.stringify(auth)) as {
        user: User
        token: string
      }
      oldAuth.user.nama = nama.current as string
      oldAuth.user.telepon = telepon.current as string
      oldAuth.user.email = email.current as string

      setAuth(oldAuth)

      Preferences.remove({ key: 'user' })
      Preferences.set({ key: 'user', value: JSON.stringify(oldAuth.user) })
      await modalController.dismiss()
    } else {
      await Dialog.alert({
        title: 'Error',
        message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
      })
    }
  }

  const close = async () => {
    await modalController.dismiss()
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
          <IonTitle>Ubah Profil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Nama</IonLabel>
            <IonInput
              type="text"
              value={nama.current}
              onIonChange={(e) => (nama.current = e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Telepon</IonLabel>
            <IonInput
              type="tel"
              value={telepon.current}
              onIonChange={(e) => (telepon.current = e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email.current}
              onIonChange={(e) => (email.current = e.detail.value as string)}
            />
          </IonItem>
        </IonList>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" onClick={() => ubah()}>
          Ubah
        </IonButton>
      </IonFooter>
    </>
  )
}
