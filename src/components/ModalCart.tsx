import { Http } from '@capacitor-community/http'
import { modalController } from '@ionic/core'
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { add, close as closeIcon, remove } from 'ionicons/icons'
import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import { authAtom, cartAtom } from '../atoms'
import { CartItem } from '../models'

import './ModalCart.css'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const ModalCart: React.FC = () => {
  const auth = useAtomValue(authAtom)
  const [cart, setCart] = useAtom(cartAtom)

  const close = async () => {
    await modalController.dismiss(false)
  }

  const checkout = async () => {
    await modalController.dismiss(true)
  }

  const deleteItem = (barang: number) => {
    Http.del({
      url: BASE_URL + '/keranjang/' + barang,
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    setCart(cart.filter((c) => c.barang.id !== barang))
  }

  const editItem = (index: number, tipe: 'inc' | 'dec') => {
    const oldCart = JSON.parse(JSON.stringify(cart)) as CartItem[]

    if (tipe === 'inc') {
      oldCart[index].jumlah = +oldCart[index].jumlah + +1
    } else if (tipe === 'dec') {
      if (oldCart[index].jumlah > 1) {
        oldCart[index].jumlah = +oldCart[index].jumlah - +1
      }
    }

    Http.patch({
      url: BASE_URL + '/keranjang/' + cart[index].barang.id,
      data: {
        jumlah: oldCart[index].jumlah,
      },
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    setCart(oldCart)
  }

  const total =
    'Rp ' +
    cart
      .reduce((prev, next) => prev + next.barang.harga * next.jumlah, 0)
      .toLocaleString('id-ID')

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon
              onClick={close}
              slot="icon-only"
              icon={closeIcon}
            ></IonIcon>
          </IonButtons>
          <IonTitle>Keranjang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {cart.length ? (
          <IonList inset lines="none">
            {cart.map((c, i) => (
              <IonItemSliding key={i}>
                <IonItem>
                  <IonAvatar slot="start" className="ion-margin-start">
                    <img
                      src={c.barang.gambar || `https://ui-avatars.com/api/?name=${c.barang.nama}`}
                      alt={c.barang.nama}
                    />
                  </IonAvatar>
                  <IonLabel className="ion-margin-start">
                    {c.barang.nama}
                  </IonLabel>
                  <div className="flex-col items-end ion-margin-top" slot="end">
                    <IonBadge>
                      <p style={{ margin: 0 }}>
                        {'Rp ' +
                          (c.jumlah * c.barang.harga).toLocaleString('id-ID')}
                      </p>
                    </IonBadge>
                    <div
                      className="inline-flex items-center justify-center"
                      style={{ marginTop: '8px', width: '100%' }}
                    >
                      <IonIcon
                        onClick={() => editItem(i, 'dec')}
                        slot="icon-only"
                        icon={remove}
                      ></IonIcon>
                      <IonInput
                        style={{ width: '40px', textAlign: 'center' }}
                        min="1"
                        value={cart[i].jumlah}
                        type="number"
                      ></IonInput>
                      <IonIcon
                        onClick={() => editItem(i, 'inc')}
                        slot="icon-only"
                        icon={add}
                      ></IonIcon>
                    </div>
                  </div>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption
                    color="danger"
                    onClick={() => deleteItem(c.barang.id)}
                  >
                    Hapus
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        ) : (
          <p className="ion-margin-start">Belum ada barang</p>
        )}
      </IonContent>

      {cart.length ? (
        <IonFooter className="ion-padding">
          <IonItem className="ion-margin-bottom" lines="none">
            <IonLabel>Total</IonLabel>
            <IonNote slot="end" color="primary">
              {total}
            </IonNote>
          </IonItem>
          <IonButton expand="block" onClick={checkout}>
            Checkout
          </IonButton>
        </IonFooter>
      ) : null}
    </>
  )
}
