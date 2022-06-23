import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { home, time, person } from 'ionicons/icons'
import Home from './pages/Home'
import Riwayat from './pages/Riwayat'
import Profil from './pages/Profil'

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

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path='/home'>
            <Home />
          </Route>
          <Route exact path='/riwayat'>
            <Riwayat />
          </Route>
          <Route path='/profil'>
            <Profil />
          </Route>
          <Route exact path='/'>
            <Redirect to='/home' />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot='bottom'>
          <IonTabButton tab='home' href='/home'>
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab='riwayat' href='/riwayat'>
            <IonIcon icon={time} />
            <IonLabel>Riwayat</IonLabel>
          </IonTabButton>
          <IonTabButton tab='profil' href='/profil'>
            <IonIcon icon={person} />
            <IonLabel>Profil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
)

export default App
