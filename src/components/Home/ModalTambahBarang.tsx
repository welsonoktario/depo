import { CapacitorHttp as Http } from '@capacitor/core'
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
import { authAtom, cartAtom } from '../../atoms'
import { Barang } from '../../models'
import './ModalTambahBarang.css'

const BASE_URL = process.env.REACT_APP_API_URL

export const ModalTambahBarang: React.FC<{ barang: Barang }> = (props) => {
  const auth = useAtomValue(authAtom)
  const [jumlah, setJumlah] = useState(props.barang.minPembelian)
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
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => cancel()}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Tambah ke Keranjang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset>
          <IonItem lines="inset">
            <IonLabel>
              <h2>{props.barang.nama}</h2>
              <p>{props.barang.deskripsi}</p>
              <p>
                Rp {props.barang.harga.toLocaleString('id-ID')} /{' '}
                {props.barang.satuan}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem className="jumlah" lines="inset">
            <IonLabel position="floating">
              Jumlah (Min. Pembelian: {props.barang.minPembelian})
            </IonLabel>
            <IonInput
              type="number"
              placeholder={props.barang.minPembelian.toString()}
              value={jumlah}
              min={props.barang.minPembelian}
              onIonChange={(e) => {
                if (e.target.value) {
                  if ((e.target.value as number) < props.barang.minPembelian) {
                    e.target.value = props.barang.minPembelian
                    setJumlah(props.barang.minPembelian)
                  } else {
                    setJumlah(e.target.value as number)
                  }
                }
              }}
            ></IonInput>
          </IonItem>
          <IonItem className="subtotal" lines="none">
            <IonText>
              Subtotal:{' '}
              {'Rp ' + (props.barang.harga * jumlah).toLocaleString('id-ID')}
            </IonText>
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
