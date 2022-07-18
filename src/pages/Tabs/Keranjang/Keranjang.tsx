import { Http } from '@capacitor-community/http'
import { Dialog } from '@capacitor/dialog'
import { IonModalCustomEvent, OverlayEventDetail } from '@ionic/core'
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { cash, pin } from 'ionicons/icons'
import { useAtom, useAtomValue } from 'jotai'
import { LngLat } from 'mapbox-gl'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { alamatAtom, authAtom, cartAtom, transaksisAtom } from '../../../atoms'
import { CardKeranjang } from '../../../components/Keranjang/CardKeranjang'
import { ModalPilihAlamat } from '../../../components/Keranjang/ModalPilihAlamat'
import { ModalPilihLokasi } from '../../../components/Keranjang/ModalPilihLokasi'
import { Alamat, CartItem } from '../../../models'
import { useIonRouter } from '../../../utils'
import './Keranjang.css'

const BASE_URL = process.env.REACT_APP_API_URL

export const Keranjang: React.FC = () => {
  const router = useIonRouter()
  const auth = useAtomValue(authAtom)
  const alamats = useAtomValue(alamatAtom)
  const modalAlamat = useRef<HTMLIonModalElement>(null)
  const [cart, setCart] = useAtom(cartAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isModalAlamatOpen, setIsModalAlamatOpen] = useState(false)
  const [lokasi, setLokasi] = useState<{
    alamat: string | undefined
    lokasi: { lat: number; lng: number } | undefined
  }>()

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

    const l = alamats.find((alamat) => alamat.isUtama)

    setLokasi({
      alamat: l?.alamat,
      lokasi: l?.lokasi,
    })
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
        lokasi: lokasi?.lokasi,
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

  const closeModal = (
    e: IonModalCustomEvent<
      OverlayEventDetail<{
        lokasi: LngLat
        alamat: string
      }>
    >
  ) => {
    setIsOpen(false)
    const data = e.detail.data

    if (data) {
      setLokasi(data)
    }
  }

  const closeModalAlamat = (
    e: IonModalCustomEvent<OverlayEventDetail<Alamat | 'pilih' | undefined>>
  ) => {
    setIsModalAlamatOpen(false)

    const data = e.detail.data
    if (data) {
      if (data === 'pilih') {
        setIsOpen(true)
      } else {
        setLokasi({
          alamat: data.alamat,
          lokasi: data.lokasi,
        })
      }
    }
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
              <IonItem
                onClick={() => setIsModalAlamatOpen(true)}
                lines="none"
                className="ion-margin-bottom"
                button
                detail
              >
                <IonIcon slot="start" icon={pin}></IonIcon>
                <IonLabel>
                  {lokasi?.alamat ? lokasi.alamat : 'Alamat Kirim'}
                </IonLabel>
              </IonItem>
              <IonItem lines="full">
                <IonIcon slot="start" icon={cash}></IonIcon>
                <IonLabel>Total</IonLabel>
                <IonNote slot="end" color="primary">
                  {total}
                </IonNote>
              </IonItem>
              <IonButton disabled={!lokasi} expand="block" onClick={checkout}>
                Checkout
              </IonButton>
            </IonFooter>
          ) : null}
        </>
      ) : null}

      <IonModal isOpen={isOpen} onDidDismiss={closeModal}>
        <ModalPilihLokasi />
      </IonModal>

      <IonModal
        ref={modalAlamat}
        isOpen={isModalAlamatOpen}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.5, 0.75]}
        onDidDismiss={closeModalAlamat}
      >
        <ModalPilihAlamat />
      </IonModal>
    </IonPage>
  )
}
