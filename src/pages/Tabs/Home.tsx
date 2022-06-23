import "./Home.css"

import { useAtom, useAtomValue } from "jotai"
import React, { useEffect, useState } from "react"
import { Virtuoso } from "react-virtuoso"

import { Http } from "@capacitor-community/http"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/react"

import { authAtom, cartAtom } from "../../atoms"
import CardBarang from "../../components/CardBarang"
import Cart from "../../components/Cart"
import { Barang } from "../../models"

const Home: React.FC = () => {
  const [cart] = useAtom(cartAtom)
  const [barangs, setBarangs] = useState<Barang[]>([])
  const [loading, setLoading] = useState(false)
  const auth = useAtomValue(authAtom)

  useEffect(() => {
    loadBarangs()
  }, [])

  const loadBarangs = async () => {
    setLoading(true)
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading ? (
          <IonSpinner className='spinner'></IonSpinner>
        ) : (
          <>
            {cart.length ? <Cart /> : null}
            {barangs.length > 0 ? (
              <Virtuoso
                initialItemCount={0}
                className='ion-content-scroll-host'
                totalCount={barangs.length}
                itemContent={(i) => {
                  return (
                    <CardBarang
                      id={barangs[i].id}
                      nama={barangs[i].nama}
                      harga={barangs[i].harga}
                      key={i}
                    ></CardBarang>
                  )
                }}
              ></Virtuoso>
            ) : null}
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Home
