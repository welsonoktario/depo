import './Home.css'

import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'

import { Http } from '@capacitor-community/http'
import {
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

import { authAtom, cartAtom } from '../../atoms'
import CardBarang from '../../components/CardBarang'
import { FABCart } from '../../components/FABCart'
import ModalTambahBarang from '../../components/ModalTambahBarang'
import { Barang } from '../../models'
import { Storage } from '@capacitor/storage'
import { ModalCart } from '../../components/ModalCart'

const Home: React.FC = () => {
  const [cart, setCart] = useAtom(cartAtom)
  const [barangs, setBarangs] = useState<Barang[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Barang>()
  const [isModalBarangOpen, setIsModalBarangOpen] = useState(false)
  const [isModalCartOpen, setIsModalCartOpen] = useState(false)

  const auth = useAtomValue(authAtom)

  useEffect(() => {
    loadBarangs()
  }, [])

  const loadBarangs = async () => {
    setLoading(true)

    const { value } = await Storage.get({ key: 'cart' })

    try {
      if (value) {
        setCart(JSON.parse(value))
      }
    } catch (e) {
      console.log(e)
    }

    const res = await Http.get({
      url: process.env.REACT_APP_BASE_URL + '/barang',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    const { data } = await res.data
    setBarangs(data)
    setLoading(false)
  }

  const openModal = (barang: Barang) => {
    setSelected(barang)
    setIsModalBarangOpen(true)
  }

  const closeModal = async (status: boolean) => {
    setIsModalBarangOpen(false)

    if (status) {
      await Storage.remove({ key: 'cart' })
      await Storage.set({ key: 'cart', value: JSON.stringify(cart) })
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
            {barangs.map((barang: any) => (
              <CardBarang
                key={barang.id}
                barang={barang}
                onClick={(b) => openModal(b)}
              ></CardBarang>
            ))}
            <FABCart onClick={() => setIsModalCartOpen(true)}></FABCart>
          </>
        )}

        {selected ? (
          <IonModal
            isOpen={isModalBarangOpen}
            onDidDismiss={(status) => closeModal(status.detail.data)}
          >
            <ModalTambahBarang barang={selected} />
          </IonModal>
        ) : null}

        <IonModal
          isOpen={isModalCartOpen}
          onDidDismiss={() => setIsModalCartOpen(false)}
        >
          <ModalCart></ModalCart>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default Home
