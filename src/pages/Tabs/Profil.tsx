import React from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import ExploreContainer from '../../components/ExploreContainer'
import './Profil.css'

const Profil: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profil</IonTitle>
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
