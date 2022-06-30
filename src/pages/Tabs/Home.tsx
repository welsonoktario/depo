import './Home.css'

import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'

import { Http } from '@capacitor-community/http'
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

import { Storage } from '@capacitor/storage'
import { authAtom, cartAtom } from '../../atoms'
import CardBarang from '../../components/CardBarang'
import { FABCart } from '../../components/FABCart'
import { ModalCart } from '../../components/ModalCart'
import ModalTambahBarang from '../../components/ModalTambahBarang'
import { Barang, Kategori } from '../../models'

const Home: React.FC = () => {
  const auth = useAtomValue(authAtom)
  const cart = useAtomValue(cartAtom)
  const [kategoris, setKategoris] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Barang>()
  const [isModalBarangOpen, setIsModalBarangOpen] = useState(false)
  const [isModalCartOpen, setIsModalCartOpen] = useState(false)

  useEffect(() => {
    loadBarangs()
  }, [])

  const loadBarangs = async () => {
    setLoading(true)

    const res = await Http.get({
      url: process.env.REACT_APP_BASE_URL + '/barang',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data } = await res.data
    setKategoris(data)
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
