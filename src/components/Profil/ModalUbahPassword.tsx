import { CapacitorHttp as Http } from '@capacitor/core'
import { Dialog } from '@capacitor/dialog'
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
import { FC, useState } from 'react'
import { authAtom } from '../../atoms'

const BASE_URL = process.env.REACT_APP_API_URL

export const ModalUbahPassword: FC = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const [passwordLama, setPasswordLama] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [confirm, setConfirm] = useState('')

  const ubah = async () => {
    if (passwordLama === passwordBaru) {
      await Dialog.alert({
        title: 'Error',
        message: 'Password baru tidak boleh sama dengan password lama',
      })
    } else if (passwordBaru !== confirm) {
      await Dialog.alert({
        title: 'Error',
        message: 'Password baru tidak cocok',
      })
    } else {
      const res = await Http.patch({
        url: BASE_URL + '/auth/' + auth.user?.id + '/password',
        data: {
          lama: passwordLama,
          baru: passwordBaru,
        },
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const { data, status } = res

      if (status !== 500) {
        await modalController.dismiss()
      } else {
        await Dialog.alert({
          title: 'Error',
          message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
        })
      }
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
          <IonTitle>Ubah Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Password Lama</IonLabel>
            <IonInput
              type="password"
              onIonChange={(e) => setPasswordLama(e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Password Baru</IonLabel>
            <IonInput
              type="password"
              onIonChange={(e) => setPasswordBaru(e.detail.value as string)}
            />
          </IonItem>
          <IonItem lines="inset" className="pl">
            <IonLabel position="floating">Ulang Password Baru</IonLabel>
            <IonInput
              type="password"
              onIonChange={(e) => setConfirm(e.detail.value as string)}
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
