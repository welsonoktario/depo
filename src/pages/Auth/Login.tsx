import { useSetAtom } from 'jotai'
import React, { useState } from 'react'

import { Http } from '@capacitor-community/http'
import { Storage } from '@capacitor/storage'
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

import { authAtom, cartAtom } from '../../atoms'
import { useIonRouter } from '../../utils'

import './Login.css'

const Login: React.FC = () => {
  const router = useIonRouter()
  const setAuth = useSetAtom(authAtom)
  const setCart = useSetAtom(cartAtom)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const register = (e: any) => router.push('/register', 'forward', 'push')

  const login = async (e: any) => {
    e.preventDefault()
    const res = await Http.post({
      url: process.env.REACT_APP_BASE_URL + '/auth/login',
      data: {
        email: form.email,
        password: form.password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const { status, msg, data } = await res.data

    if (status === 'OK') {
      await Storage.clear()
      const cart = data.user.customer.barangs

      await Storage.set({ key: 'cart', value: JSON.stringify(cart) })
      setCart(cart)

      delete data.user.customer.barangs

      await Storage.set({ key: 'user', value: JSON.stringify(data) })
      await Storage.set({ key: 'token', value: data.token })
      setAuth({
        user: data.user,
        token: data.token,
      })
      router.push('/tabs', 'forward', 'replace')
    } else {
      alert(msg)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={login}>
          <IonList inset>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                name="email"
                type="email"
                value={form.email}
                onIonChange={(e) => handleChange(e)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                name="password"
                type="password"
                value={form.password}
                onIonChange={(e) => handleChange(e)}
              ></IonInput>
            </IonItem>
          </IonList>

          <IonButton type="submit" expand="block" className="ion-margin">
            Login
          </IonButton>
        </form>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonButton expand="block" fill="clear" onClick={register}>
          Daftar Akun
        </IonButton>
      </IonFooter>
    </IonPage>
  )
}

export default Login
