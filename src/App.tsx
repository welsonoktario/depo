import { Storage } from '@capacitor/storage'
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { authAtom } from './atoms'

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
import './App.css'
import { Login } from './pages/Auth/Login/Login'
import { Register } from './pages/Auth/Register/Register'
import { Tabs } from './pages/Tabs/Tabs'
import './theme/variables.css'

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
            </IonRouterOutlet>
          </Switch>
        </IonReactRouter>
      </IonApp>
    )
  }
}

export default App
