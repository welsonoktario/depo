import { Preferences } from '@capacitor/preferences'
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { useAtom, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { alamatAtom, authAtom } from './atoms'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'

/* Theme variables */
import { Http } from '@capacitor-community/http'
import { Dialog } from '@capacitor/dialog'
import './App.css'
import { Login } from './pages/Auth/Login/Login'
import { Register } from './pages/Auth/Register/Register'
import { Kurir } from './pages/Kurir/Kurir'
import { Tabs } from './pages/Tabs/Tabs'
import './theme/variables.css'

setupIonicReact()

const BASE_URL = process.env.REACT_APP_API_URL

const App: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [auth, setAuth] = useAtom(authAtom)
  const setAlamats = useSetAtom(alamatAtom)

  useEffect(() => {
    const getAuth = async () => {
      setLoading(true)
      const userJson = await Preferences.get({ key: 'user' })
      const tokenString = await Preferences.get({ key: 'token' })

      if (
        userJson.value &&
        userJson.value !== 'null' &&
        tokenString.value &&
        tokenString.value !== 'null'
      ) {
        setAuth({
          user: JSON.parse(userJson.value),
          token: tokenString.value,
        })

        if (auth.user?.role === 'Customer') {
          const res = await Http.get({
            url: BASE_URL + '/alamat',
            headers: {
              Authorization: `Bearer ${tokenString.value}`,
              Accept: 'application/json',
            },
          })

          const { data, status } = res

          if (status !== 500) {
            setAlamats(data.data)
          } else {
            await Dialog.alert({
              title: 'Error',
              message: 'Terjadi kesalahan sistem, silahkan coba lagi nanti',
            })
          }
        }
      }

      setLoading(false)
    }

    getAuth()
  }, [])

  const ProtectedRoute: React.ComponentType<any> = ({
    component: Component,
    ...rest
  }: {
    component: React.ComponentType<RouteProps>
  }) => (
    <Route
      {...rest}
      render={(props) => {
        let u = auth.user
        return u ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }}
    />
  )

  if (loading) {
    return <IonSpinner className="spinner"></IonSpinner>
  } else {
    return (
      <IonApp>
        <IonReactRouter>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Redirect exact from="/" to="/tabs" />
            <IonRouterOutlet>
              <ProtectedRoute name="tabs" path="/tabs" component={Tabs} />
              <ProtectedRoute name="kurir" path="/kurir" component={Kurir} />
            </IonRouterOutlet>
          </Switch>
        </IonReactRouter>
      </IonApp>
    )
  }
}

export default App
