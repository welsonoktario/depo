import {
  IonApp,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { add } from 'ionicons/icons'
import { FC } from 'react'

const Alamat: FC = () => {

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/profil" />
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

        <IonList inset>
          
        </IonList>
      </IonContent>
    </IonApp>
  )
}

export default Alamat
