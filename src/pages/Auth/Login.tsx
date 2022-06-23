import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Storage } from '@capacitor/storage'
import { Http } from '@capacitor-community/http'
import React, { useState } from 'react'
import { useSetAtom } from 'jotai'
import { authAtom } from '../../atoms'
import { useHistory } from 'react-router'

const Login: React.FC = () => {
  const history = useHistory()
  const setAuth = useSetAtom(authAtom)
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
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <form onSubmit={login}>
          <IonItem>
            <IonLabel position='stacked'>Email</IonLabel>
            <IonInput
              name='email'
              type='email'
              value={form.email}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Password</IonLabel>
            <IonInput
              name='password'
              type='password'
              value={form.password}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>

          <IonButton type='submit' expand='block'>
            Login
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default Login
