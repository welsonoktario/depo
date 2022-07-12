import { Storage } from '@capacitor/storage'
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { lockClosedOutline, logOutOutline, pinOutline } from 'ionicons/icons'
import { useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { authAtom } from '../../../atoms'
import { ModalAlamat } from '../../../components/Profil/ModalAlamat'
import { useIonRouter } from '../../../utils'
import './Profil.css'

export const Profil: React.FC = () => {
  const router = useIonRouter()
  const setAuth = useSetAtom(authAtom)
  const [isModalAlamatOpen, setIsModalAlamatOpen] = useState(false)

  const logout = async () => {
    await Storage.clear()
    setAuth({
      user: null,
      token: '',
    })

    router.push('/login', 'back', 'replace')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profil</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList inset>
          <IonItem button detail onClick={() => setIsModalAlamatOpen(true)}>
            <IonIcon icon={pinOutline} slot="start"></IonIcon>
            <IonLabel>Alamat</IonLabel>
          </IonItem>
          <IonItem button detail>
            <IonIcon icon={lockClosedOutline} slot="start"></IonIcon>
            <IonLabel>Ubah Password</IonLabel>
          </IonItem>
          <IonItem lines="none" onClick={logout} button detail>
            <IonIcon color="danger" icon={logOutOutline} slot="start"></IonIcon>
            <IonLabel color="danger">Keluar</IonLabel>
          </IonItem>
        </IonList>

        <IonModal
          isOpen={isModalAlamatOpen}
          onDidDismiss={() => setIsModalAlamatOpen(false)}
        >
          <ModalAlamat />
        </IonModal>
      </IonContent>
    </IonPage>
  )
}
