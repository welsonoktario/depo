import { Http } from '@capacitor-community/http'
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
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import { useAtom, useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { authAtom, cartAtom } from '../atoms'
import { Barang } from '../models'
import './ModalTambahBarang.css'

const BASE_URL = process.env.REACT_APP_BASE_URL

const ModalTambahBarang: React.FC<{ barang: Barang }> = (props) => {
  const auth = useAtomValue(authAtom)
  const [jumlah, setJumlah] = useState(1)
  const [cart, setCart] = useAtom(cartAtom)

  const addToCart = async (barang: Barang) => {
    const exist = cart.findIndex((item) => item.barang.id === barang.id)

    if (exist !== -1) {
      const newCart = [...cart]

      const res = await Http.patch({
        url: BASE_URL + '/keranjang/' + barang.id,
        data: {
          barang: barang.id,
          jumlah: +newCart[exist].jumlah + +jumlah,
        },
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const data = await res.data

      if (data.msg === 'OK') {
        newCart[exist].jumlah = +newCart[exist].jumlah + +jumlah
        setCart(newCart)
      } else {
        console.log(data)
      }
    } else {
      const res = await Http.post({
        url: BASE_URL + '/keranjang/',
        data: {
          barang: barang.id,
          jumlah,
        },
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const data = await res.data

      if (data.msg === 'OK') {
        setCart([...cart, { barang, jumlah }])
      } else {
        console.log(data)
      }
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

      <IonContent>
        <IonList inset>
          <IonItem>
            <IonLabel position="floating">Jumlah</IonLabel>
            <IonInput
              type="number"
              placeholder="1"
              value={jumlah}
              min={1}
              onIonChange={(e) => setJumlah(e.target.value as number)}
            ></IonInput>
          </IonItem>
          <IonItem className="subtotal">
            <IonText>Subtotal: {"Rp " + (props.barang.harga * jumlah).toLocaleString('id-ID')}</IonText>
          </IonItem>
        </IonList>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" onClick={() => addToCart(props.barang)}>
          Tambah
        </IonButton>
      </IonFooter>
    </>
  )
}

export default ModalTambahBarang
