import './Riwayat.css'

import React, { useEffect } from 'react'

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useAtom, useAtomValue } from 'jotai'
import { authAtom, transaksisAtom } from '../../atoms'
import { Http } from '@capacitor-community/http'

const Riwayat: React.FC = () => {
  useEffect(() => {
    const loadTransaksis = async () => {
      const res = await Http.get({
        url: process.env.REACT_APP_BASE_URL + '/transaksi',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
        },
      })

      const { data } = await res.data

      setTransaksis(data)
    }

    loadTransaksis()
  }, [])

  const auth = useAtomValue(authAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)

  const transaksiCards = transaksis.map((transaksi) => (
    <p key={transaksi.id}>{transaksi.id}</p>
  ))

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Riwayat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Riwayat</IonTitle>
          </IonToolbar>
        </IonHeader>

        <>{transaksis.length ? transaksiCards : <p>Kosong</p>}</>
      </IonContent>
    </IonPage>
  )
}

export default Riwayat
