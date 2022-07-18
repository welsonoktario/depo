import { Http } from '@capacitor-community/http'
import { Storage } from '@capacitor/storage'
import {
  IonModalCustomEvent,
  IonRefresherCustomEvent,
  OverlayEventDetail,
} from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react'
import { logOut } from 'ionicons/icons'
import { useAtom } from 'jotai'
import { FC, useCallback, useEffect, useState } from 'react'
import { authAtom, transaksisAtom } from '../../atoms'
import { ModalDetailTransaksi } from '../../components/Kurir/ModalDetailTransaksi'
import { CardRiwayat } from '../../components/Riwayat/CardRiwayat'
import { Transaksi } from '../../models'
import { useIonRouter } from '../../utils'

const BASE_URL = process.env.REACT_APP_API_URL

export const Kurir: FC = () => {
  const router = useIonRouter()
  const [auth, setAuth] = useAtom(authAtom)
  const [transaksis, setTransaksis] = useAtom(transaksisAtom)
  const [selected, setSelected] = useState<Transaksi>()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTransaksis(undefined)
  }, [])

  const loadTransaksis = useCallback(
    async (
      event: IonRefresherCustomEvent<RefresherEventDetail> | undefined
    ) => {
      setLoading(true)
      const res = await Http.get({
        url: BASE_URL + '/transaksi',
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

  const closeModal = (
    e: IonModalCustomEvent<
      OverlayEventDetail<
        | {
            id: number
            status: string
          }
        | undefined
      >
    >
  ) => {
    setIsOpen(false)
    const data = e.detail.data

    if (data) {
      const oldTransaksis = JSON.parse(
        JSON.stringify(transaksis)
      ) as Transaksi[]
      const index = oldTransaksis.findIndex((t) => t.id === data.id)
      oldTransaksis[index].status = data.status

      setTransaksis(oldTransaksis)
    }
  }

  const logout = async () => {
    Storage.clear()
    setAuth({
      user: null,
      token: '',
    })

    router.push('/login', 'back', 'replace')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={logout}>
              <IonIcon slot="icon-only" icon={logOut}></IonIcon>
            </IonButton>
          </IonButtons>
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
