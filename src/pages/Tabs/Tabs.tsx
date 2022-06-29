import React from 'react'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route } from 'react-router'
import { home, time, person } from 'ionicons/icons'
import Home from './Home'
import Riwayat from './Riwayat'
import Profil from './Profil'

const Tabs: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/tabs/home">
              <Home />
            </Route>
            <Route exact path="/tabs/riwayat">
              <Riwayat />
            </Route>
            <Route exact path="/tabs/profil">
              <Profil />
            </Route>
            <Route exact path="/tabs">
              <Redirect to="/tabs/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="/tabs/home" href="/tabs/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="/tabs/riwayat" href="/tabs/riwayat">
              <IonIcon icon={time} />
              <IonLabel>Riwayat</IonLabel>
            </IonTabButton>
            <IonTabButton tab="/tabs/profil" href="/tabs/profil">
              <IonIcon icon={person} />
              <IonLabel>Profil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default Tabs
