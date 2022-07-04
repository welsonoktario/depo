import { modalController } from '@ionic/core'
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { close as closeIcon } from 'ionicons/icons'
import { useAtom } from 'jotai'
import React from 'react'
import { cartAtom } from '../atoms'

import './ModalCart.css'

export const ModalCart: React.FC = () => {
  const [cart, setCart] = useAtom(cartAtom)

  const close = async () => {
    await modalController.dismiss(false)
  }

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
                  <div className="flex-col" style={{ width: '100%' }}>
                    <div className="flex-row justify-between items-center">
                      <IonLabel>{c.barang.nama}</IonLabel>
                      <IonBadge>
                        x{c.jumlah} @ {'Rp ' + c.barang.harga.toLocaleString('id-ID')}
                      </IonBadge>
                    </div>
                    <div className="flex-row justify-end">
                      <p>
                        {'Rp ' +
                          (c.jumlah * c.barang.harga).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => {}}>
                    Hapus
                  </IonItemOption>
                  <IonItemOption color="primary" onClick={() => {}}>
                    Edit
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        ) : (
          <p>Belum ada barang</p>
        )}
      </IonContent>

      {cart.length ? (
        <IonFooter className="ion-padding">
          <IonButton expand="block">Checkout</IonButton>
        </IonFooter>
      ) : null}
    </>
  )
}
