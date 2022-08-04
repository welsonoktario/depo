import { Http } from '@capacitor-community/http'
import { Dialog } from '@capacitor/dialog'
import { Preferences } from '@capacitor/preferences'
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
import { useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { authAtom, cartAtom } from '../../../atoms'
import { useIonRouter } from '../../../utils'

export const Login: React.FC = () => {
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

  const login = async (e: any) => {
    e.preventDefault()
    const res = await Http.post({
      url: process.env.REACT_APP_API_URL + '/auth/login',
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
      await Preferences.clear()

      if (data.user.customer) {
        const cart = data.user.customer.barangs
        setCart(cart)
        delete data.user.customer.barangs
      }

      await Preferences.set({ key: 'user', value: JSON.stringify(data) })
      await Preferences.set({ key: 'token', value: data.token })
      setAuth({
        user: data.user,
        token: data.token,
      })

      if (data.user.role === 'Customer') {
        router.push('/tabs')
      } else if (data.user.role === 'Kurir') {
        router.push('/kurir')
      }
    } else {
      await Dialog.alert({
        title: 'Error',
        message: msg,
      })
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={login}>
          <IonList inset lines="none">
            <IonItem className="pl">
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                name="email"
                type="email"
                value={form.email}
                onIonChange={(e) => handleChange(e)}
              ></IonInput>
            </IonItem>
            <IonItem lines="none" className="pl">
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
        <IonButton
          expand="block"
          fill="clear"
          routerLink="/register"
          routerDirection="forward"
        >
          Daftar Akun
        </IonButton>
      </IonFooter>
    </IonPage>
  )
}
