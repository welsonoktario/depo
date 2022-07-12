import { IonIcon, IonItem, IonLabel } from '@ionic/react'
import { checkmarkCircle } from 'ionicons/icons'
import { FC } from 'react'
import { Alamat } from '../../../models'

export const CardAlamat: FC<{ alamat: Alamat }> = ({ alamat }) => {
  return (
    <IonItem button lines="none">
      <IonLabel>
        <h3>{alamat.nama}</h3>
        <p>{alamat.alamat}</p>
      </IonLabel>
      {alamat.isUtama ? (
        <IonIcon color="success" slot="end" icon={checkmarkCircle}></IonIcon>
      ) : null}
    </IonItem>
  )
}
