import { IonBadge, IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { cart as cartIcon } from 'ionicons/icons'
import { useAtom } from 'jotai'
import React from 'react'
import { cartAtom } from '../atoms'

import './FABCart.css'

export const FABCart: React.FC<{
  onClick: () => void
}> = (props) => {
  const [cart] = useAtom(cartAtom)

  return (
    <IonFab
      vertical="bottom"
      horizontal="end"
      slot="fixed"
      onClick={props.onClick}
    >
      <IonFabButton>
        {cart.length ? <IonBadge color="danger">{cart.length}</IonBadge> : null}
        <IonIcon icon={cartIcon} />
      </IonFabButton>
    </IonFab>
  )
}
