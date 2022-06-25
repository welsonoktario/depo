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
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { cartAtom } from '../atoms'
import { Barang } from '../models'

const ModalTambahBarang: React.FC<{ barang: Barang }> = (props) => {
  const [jumlah, setJumlah] = useState(1)
  const [cart, setCart] = useAtom(cartAtom)

  const addToCart = async (barang: Barang) => {
    const exist = cart.findIndex((item) => item.barang.id === barang.id)

    if (exist !== -1) {
      const newCart = [...cart]
      newCart[exist].jumlah += jumlah
      setCart(newCart)
    } else {
      setCart([...cart, { barang, jumlah }])
    }
    await modalController.dismiss(true)
  }

  const cancel = async () => {
    await modalController.dismiss(false)
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon onClick={cancel} slot="icon-only" icon={close}></IonIcon>
          </IonButtons>
          <IonTitle>Tambah ke Keranjang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Jumlah</IonLabel>
          <IonInput
            type="number"
            placeholder="Jumlah"
            value={jumlah}
            onIonChange={(e) => setJumlah(e.target.value as number)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonText>Subtotal: {props.barang.harga * jumlah}</IonText>
        </IonItem>
      </IonContent>

      <IonFooter>
        <IonButton onClick={() => addToCart(props.barang)}>Tambah</IonButton>
      </IonFooter>
    </>
  )
}

export default ModalTambahBarang
