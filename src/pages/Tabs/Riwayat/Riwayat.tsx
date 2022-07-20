import { Http } from '@capacitor-community/http'
import {
  IonModalCustomEvent,
  IonRefresherCustomEvent,
  OverlayEventDetail,
} from '@ionic/core'
import {
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react'
import { useAtom, useAtomValue } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { authAtom, transaksisAtom } from '../../../atoms'
import { CardRiwayat } from '../../../components/Riwayat/CardRiwayat'
import { ModalDetailTransaksi } from '../../../components/Riwayat/ModalDetailTransaksi'
import { Transaksi } from '../../../models'
import './Riwayat.css'

export const Riwayat: React.FC = () => {
  useEffect(() => {
    loadTransaksis(undefined)
  }, [])

  const auth = useAtomValue(authAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)
  const [selected, setSelected] = useState<Transaksi>()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadTransaksis = useCallback(
    async (
      event: IonRefresherCustomEvent<RefresherEventDetail> | undefined
    ) => {
      setLoading(true)
      const res = await Http.get({
        url: process.env.REACT_APP_API_URL + '/transaksi',
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
      setLoading(false)
    },
    [auth, setTransaksis]
  )

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

  const closeModal = async (
    e: IonModalCustomEvent<
      OverlayEventDetail<{ id: number; status: string } | undefined>
    >
  ) => {
    setIsOpen(false)
    const data = e.detail.data

    if (data) {
      setTimeout(() => loadTransaksis(undefined), 500)
    }
  }

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

        {loading ? (
          <IonSpinner className="spinner"></IonSpinner>
        ) : (
          <>
            <IonRefresher slot="fixed" onIonRefresh={loadTransaksis}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>

            {transaksis.length ? transaksiCards : <p>Kosong</p>}
            <IonModal
              isOpen={isOpen}
              canDismiss={true}
              onDidDismiss={closeModal}
            >
              {selected ? (
                <ModalDetailTransaksi
                  transaksi={selected}
                ></ModalDetailTransaksi>
              ) : null}
            </IonModal>
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
