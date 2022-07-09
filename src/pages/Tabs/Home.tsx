import './Home.css'

import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'

import { Http } from '@capacitor-community/http'
import { Dialog } from '@capacitor/dialog'
import {
  IonContent,
  IonHeader,
  IonItem,
  IonListHeader,
  IonModal,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

import { authAtom, cartAtom, transaksisAtom } from '../../atoms'
import CardBarang from '../../components/CardBarang'
import { FABCart } from '../../components/FABCart'
import { ModalCart } from '../../components/ModalCart'
import ModalTambahBarang from '../../components/ModalTambahBarang'
import { Barang, Kategori } from '../../models'
import { useIonRouter } from '../../utils'

const BASE_URL = process.env.REACT_APP_BASE_URL

const Home: React.FC = () => {
  const router = useIonRouter()
  const auth = useAtomValue(authAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)
  const [kategoris, setKategoris] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Barang>()
  const [isModalBarangOpen, setIsModalBarangOpen] = useState(false)
  const [isModalCartOpen, setIsModalCartOpen] = useState(false)

  useEffect(() => {
    loadBarangs()
    loadKeranjang()
  }, [])

  const loadBarangs = async () => {
    setLoading(true)

    const res = await Http.get({
      url: BASE_URL + '/barang',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data } = await res.data
    setKategoris(data)
    setLoading(false)
  }

  const loadKeranjang = async () => {
    setLoading(true)

    const res = await Http.get({
      url: BASE_URL + '/keranjang',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data } = await res.data
    setCart(data)
    setLoading(false)
  }

  const openModal = (barang: Barang) => {
    setSelected(barang)
    setIsModalBarangOpen(true)
  }

  const closeModal = async () => {
    setIsModalBarangOpen(false)
  }

  const checkout = async (isCheckout: boolean) => {
    setIsModalCartOpen(false)

    if (isCheckout) {
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
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading ? (
          <IonSpinner className="spinner"></IonSpinner>
        ) : (
          <>
            {kategoris.map((kategori: Kategori) => (
              <div key={'k' + kategori.id}>
                <IonListHeader className="list-header">
                  {kategori.nama}
                </IonListHeader>
                {kategori.barangs.map((barang: Barang) => (
                  <IonItem
                    key={'b' + barang.id}
                    lines="none"
                    className="card-barang"
                  >
                    <CardBarang
                      barang={barang}
                      onClick={(b) => openModal(b)}
                    ></CardBarang>
                  </IonItem>
                ))}
              </div>
            ))}
            <FABCart onClick={() => setIsModalCartOpen(true)}></FABCart>
          </>
        )}

        {selected ? (
          <IonModal
            isOpen={isModalBarangOpen}
            onDidDismiss={() => closeModal()}
          >
            <ModalTambahBarang barang={selected} />
          </IonModal>
        ) : null}

        <IonModal
          isOpen={isModalCartOpen}
          onDidDismiss={(status) => checkout(status.detail.data)}
        >
          <ModalCart></ModalCart>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default Home
