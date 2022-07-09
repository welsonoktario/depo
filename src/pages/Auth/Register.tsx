import { Http } from '@capacitor-community/http'
import { Storage } from '@capacitor/storage'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { authAtom } from '../../atoms'

import { arrowBack } from 'ionicons/icons'
import { useIonRouter } from '../../utils'
import './Register.css'

export const Register: React.FC = () => {
  const router = useIonRouter()
  const setAuth = useSetAtom(authAtom)
  const [form, setForm] = useState({
    nama: '',
    telepon: '',
    email: '',
    password: '',
    alamat: '',
    lokasi: {
      lat: 0.0,
      long: 0.0,
    },
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const register = async (e: any) => {
    e.preventDefault()
    const res = await Http.post({
      url: process.env.REACT_APP_BASE_URL + '/auth/register',
      data: form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    })

    const { status, msg, data } = await res.data

    if (status == 'OK') {
      await Storage.clear()
      await Storage.set({ key: 'user', value: JSON.stringify(data.user) })
      await Storage.set({ key: 'token', value: JSON.stringify(data.token) })
      setAuth({
        user: data.user,
        token: data.token,
      })
      router.push('/tabs', 'forward', 'replace')
    } else {
      alert(msg)
    }
  }

  const back = (e: any) => {
    router.goBack()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="login" />
          </IonButtons>
          <IonTitle>Daftar Akun</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={register}>
          <IonList inset lines="none">
            <IonItem className="pl">
              <IonLabel position="floating">Nama</IonLabel>
              <IonInput
                name="nama"
                type="text"
                placeholder="Nama"
                autocomplete="nickname"
                value={form.nama}
                onIonChange={handleChange}
              ></IonInput>
            </IonItem>
            <IonItem className="pl">
              <IonLabel position="floating">Telepon</IonLabel>
              <IonInput
                name="telepon"
                type="tel"
                placeholder="Telepon"
                value={form.telepon}
                onIonChange={handleChange}
              ></IonInput>
            </IonItem>
            <IonItem className="pl">
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onIonChange={handleChange}
              ></IonInput>
            </IonItem>
            <IonItem className="pl">
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onIonChange={handleChange}
              ></IonInput>
            </IonItem>
            <IonItem className="pl" lines="none">
              <IonLabel position="floating">Alamat</IonLabel>
              <IonTextarea
                name="alamat"
                placeholder="Alamat"
                value={form.alamat}
                onIonChange={handleChange}
              ></IonTextarea>
            </IonItem>
          </IonList>
        </form>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton type="submit" expand="block">
          Register
        </IonButton>
      </IonFooter>
    </IonPage>
  )
}
