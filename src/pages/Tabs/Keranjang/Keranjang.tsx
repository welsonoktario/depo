import { Http } from '@capacitor-community/http'
import { Dialog } from '@capacitor/dialog'
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { cash, pin } from 'ionicons/icons'
import { useAtom, useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { authAtom, cartAtom, transaksisAtom } from '../../../atoms'
import { CardKeranjang } from '../../../components/Keranjang/CardKeranjang'
import { CartItem } from '../../../models'
import { useIonRouter } from '../../../utils'
import './Keranjang.css'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const Keranjang: React.FC = () => {
  const router = useIonRouter()
  const auth = useAtomValue(authAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadKeranjang()
  }, [])

  const loadKeranjang = useCallback(async () => {
    setLoading(true)

    const res = await Http.get({
      url: BASE_URL + '/keranjang',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data, status } = res

    if (status !== 500) {
      setCart(data.data)
    } else {
      await Dialog.alert({
        title: 'Error',
        message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
      })
    }

    setLoading(false)
  }, [auth, setCart])

  const checkout = async () => {
    const res = await Http.post({
      url: BASE_URL + '/transaksi',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        cart,
      },
    })

    const { data, status } = res

    console.log(status, data)

    if (status !== 500) {
      setCart([])
      const oldTransaksis = transaksis
      oldTransaksis.unshift(data.data)
      setTransaksis(oldTransaksis)
      router.push('/tabs/riwayat', 'root')
    } else {
      await Dialog.alert({
        title: 'Error',
        message: data.msg,
      })
    }
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

  const editItem = (barang: number, tipe: 'inc' | 'dec') => {
    const oldCart = JSON.parse(JSON.stringify(cart)) as CartItem[]
    const index = oldCart.findIndex((b) => b.barang.id === barang)

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
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Keranjang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <IonSpinner className="spinner"></IonSpinner>
        ) : (
          <>
            {cart.length ? (
              <IonList inset lines="none">
                {cart.map((c, i) => (
                  <CardKeranjang
                    cartItem={c}
                    onEditClick={editItem}
                    onHapusClick={deleteItem}
                    key={i}
                  />
                ))}
              </IonList>
            ) : (
              <p className="ion-margin-start">Belum ada barang</p>
            )}
          </>
        )}
      </IonContent>

      {!loading ? (
        <>
          {cart.length ? (
            <IonFooter className="ion-padding">
              <IonItem lines="none">
                <IonIcon slot="start" icon={cash}></IonIcon>
                <IonLabel>Total</IonLabel>
                <IonNote slot="end" color="primary">
                  {total}
                </IonNote>
              </IonItem>
              <IonItem
                onClick={() => console.log('helo')}
                className="ion-margin-bottom"
                lines="full"
                button
                detail
              >
                <IonIcon slot="start" icon={pin}></IonIcon>
                <IonLabel>Alamat Kirim</IonLabel>
              </IonItem>
              <IonButton expand="block" onClick={checkout}>
                Checkout
              </IonButton>
            </IonFooter>
          ) : null}
        </>
      ) : null}
    </IonPage>
  )
}
