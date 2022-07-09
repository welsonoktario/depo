import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { useAtom, useSetAtom } from 'jotai'
import { authAtom, cartAtom } from './atoms'
import { Storage } from '@capacitor/storage'
import Login from './pages/Auth/Login'
import Tabs from './pages/Tabs/Tabs'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import './App.css'
import { Register } from './pages/Auth/Register'

setupIonicReact()

const App: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [auth, setAuth] = useAtom(authAtom)

  useEffect(() => {
    const getAuth = async () => {
      setLoading(true)
      const userJson = await Storage.get({ key: 'user' })
      const tokenString = await Storage.get({ key: 'token' })

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
      }

      setLoading(false)
    }

    getAuth()
  }, [])

  if (loading) {
    return <IonSpinner className="spinner"></IonSpinner>
  } else {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            {auth && auth.user ? (
              <>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/tabs" component={Tabs} />
                <Redirect exact from="/" to="/tabs" />
              </>
            ) : (
              <>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/tabs" component={Tabs} />
                <Redirect exact from="/" to="/login" />
              </>
            )}
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    )
  }
}

export default App
