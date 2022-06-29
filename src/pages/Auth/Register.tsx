import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Storage } from '@capacitor/storage'
import { Http } from '@capacitor-community/http'
import React, { useState } from 'react'
import { useSetAtom } from 'jotai'
import { authAtom } from '../../atoms'
import { useHistory } from 'react-router'

import './Register.css'

export const Register: React.FC = () => {
  const history = useHistory()
  const setAuth = useSetAtom(authAtom)
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    alamat: '',
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
      history.replace('/tabs')
    } else {
      alert(msg)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Daftar Akun</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={register}>
          <IonList inset>
            <IonItem>
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
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onIonChange={handleChange}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onIonChange={handleChange}
              ></IonInput>
            </IonItem>
            <IonItem>
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
