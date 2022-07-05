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
import { useHistory } from 'react-router'
import { authAtom } from '../../atoms'
import ExploreContainer from '../../components/ExploreContainer'
import './Profil.css'

const Profil: React.FC = () => {
  const history = useHistory()
  const setAuth = useSetAtom(authAtom)

  const logout = async () => {
    await Storage.clear()
    setAuth({
      user: null,
      token: '',
    })

    history.replace('/login')
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
