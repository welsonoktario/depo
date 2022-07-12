import { Http } from '@capacitor-community/http'
import { Dialog } from '@capacitor/dialog'
import { modalController } from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { add, close as closeIcon } from 'ionicons/icons'
import { useAtom, useAtomValue } from 'jotai'
import { FC, useCallback, useEffect } from 'react'
import { alamatAtom, authAtom } from '../../atoms'
import { CardAlamat } from './Alamat/CardAlamat'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const ModalAlamat: FC = () => {
  const auth = useAtomValue(authAtom)
  const [alamats, setAlamat] = useAtom(alamatAtom)

  useEffect(() => {
    loadAlamat()
  }, [])

  const loadAlamat = useCallback(async () => {
    const res = await Http.get({
      url: BASE_URL + '/alamat',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data, status } = res

    if (status !== 500) {
      setAlamat(data.data)
    } else {
      await Dialog.alert({
        title: 'Error',
        message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
      })
    }
  }, [])

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
          <IonTitle>Alamat</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Alamat</IonTitle>
          </IonToolbar>
        </IonHeader>

        {alamats ? (
          <IonList inset lines="none">
            {alamats.map((alamat) => (
              <CardAlamat alamat={alamat} key={alamat.id} />
            ))}
          </IonList>
        ) : null}
      </IonContent>
    </>
  )
}
