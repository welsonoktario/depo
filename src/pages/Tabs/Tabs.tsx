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
import { home, person, time } from 'ionicons/icons'
import React from 'react'
import { Redirect, Route } from 'react-router'
import Home from './Home/Home'
import Profil from './Profil/Profil'
import Riwayat from './Riwayat/Riwayat'

const Tabs: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tabs/home" component={Home} />
            <Route exact path="/tabs/riwayat" component={Riwayat} />
            <Route exact path="/tabs/profil" component={Profil} />
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
