import './Riwayat.css'

import React, { useEffect, useState } from 'react'

import {
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react'
import { useAtom, useAtomValue } from 'jotai'
import { authAtom, transaksisAtom } from '../../atoms'
import { Http } from '@capacitor-community/http'
import CardRiwayat from '../../components/CardRiwayat'
import ModalDetailTransaksi from '../../components/ModalDetailTransaksi'
import { Transaksi } from '../../models'

const Riwayat: React.FC = () => {
  useEffect(() => {
    loadTransaksis(null)
  }, [])

  const auth = useAtomValue(authAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)
  const [selected, setSelected] = useState<Transaksi>()
  const [isOpen, setIsOpen] = useState(false)

  const loadTransaksis = async (event: any) => {
    const res = await Http.get({
      url: process.env.REACT_APP_BASE_URL + '/transaksi',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
    })

    const { data } = await res.data

    setTransaksis(data)

    if (event) {
      event.detail.complete()
    }
  }

  const transaksiCards = transaksis.map((transaksi) => (
    <CardRiwayat
      key={transaksi.id}
      transaksi={transaksi}
      onClick={(selectedTransaksi) => {
        setSelected(selectedTransaksi)
        setIsOpen(true)
      }}
    ></CardRiwayat>
  ))

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Riwayat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Riwayat</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={loadTransaksis}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {transaksis.length ? transaksiCards : <p>Kosong</p>}
        <IonModal
          isOpen={isOpen}
          canDismiss={true}
          onDidDismiss={() => setIsOpen(false)}
        >
          {selected ? (
            <ModalDetailTransaksi transaksi={selected}></ModalDetailTransaksi>
          ) : null}
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default Riwayat
