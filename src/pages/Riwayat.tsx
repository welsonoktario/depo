import React from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import './Riwayat.css'

const Riwayat: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Riwayat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Riwayat</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name='Riwayat page' />
      </IonContent>
    </IonPage>
  )
}

export default Riwayat
