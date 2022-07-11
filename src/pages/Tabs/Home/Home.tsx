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
import { useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { authAtom } from '../../../atoms'
import { CardBarang } from '../../../components/Home/CardBarang'
import { ModalTambahBarang } from '../../../components/Home/ModalTambahBarang'
import { Barang, Kategori } from '../../../models'
import './Home.css'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const Home: React.FC = () => {
  const auth = useAtomValue(authAtom)
  const [kategoris, setKategoris] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Barang>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadBarangs()
  }, [])

  const loadBarangs = useCallback(async () => {
    setLoading(true)

    const res = await Http.get({
      url: BASE_URL + '/barang',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data, status } = res

    if (status !== 500) {
      setKategoris(data.data)
    } else {
      await Dialog.alert({
        title: 'Error',
        message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
      })
    }

    setLoading(false)
  }, [auth.token])

  const openModal = (barang: Barang) => {
    setSelected(barang)
    setIsOpen(true)
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
          </>
        )}

        {selected ? (
          <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
            <ModalTambahBarang barang={selected} />
          </IonModal>
        ) : null}
      </IonContent>
    </IonPage>
  )
}
