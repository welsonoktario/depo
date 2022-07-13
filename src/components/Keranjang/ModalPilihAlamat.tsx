import { modalController } from '@ionic/core'
import { IonContent, IonItem, IonLabel, IonList } from '@ionic/react'
import { useAtomValue } from 'jotai'
import { FC } from 'react'
import { alamatAtom } from '../../atoms'
import { Alamat } from '../../models'

export const ModalPilihAlamat: FC = () => {
  const alamats = useAtomValue(alamatAtom)

  const pilihAlamat = async (data: Alamat | 'pilih') => {
    await modalController.dismiss(data)
  }

  return (
    <IonContent className="ion-padding">
      <IonList>
        <IonItem
          onClick={() => pilihAlamat('pilih')}
          lines="full"
          detail
          button
        >
          <IonLabel>Pilih dari map</IonLabel>
        </IonItem>
        {alamats.map((alamat) => (
          <IonItem
            onClick={() => pilihAlamat(alamat)}
            lines="full"
            key={`alamat-${alamat.id}`}
            button
            detail
          >
            <IonLabel>{alamat.nama}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  )
}
