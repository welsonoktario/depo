import { Storage } from '@capacitor/storage'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { logOut } from 'ionicons/icons'
import { useSetAtom } from 'jotai'
import React from 'react'
import { authAtom } from '../../atoms'
import ExploreContainer from '../../components/ExploreContainer'
import { useIonRouter } from '../../utils'
import './Profil.css'

const Profil: React.FC = () => {
  const router = useIonRouter()
  const setAuth = useSetAtom(authAtom)

  const logout = async () => {
    await Storage.clear()
    setAuth({
      user: null,
      token: '',
    })

    router.push('/login', 'root', 'replace')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profil</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout}>
              <IonIcon slot="icon-only" icon={logOut}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Profil page" />
      </IonContent>
    </IonPage>
  )
}

export default Profil
