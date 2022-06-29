import { UseIonRouterResult, IonRouterContext } from '@ionic/react'
import React, { useContext } from 'react'

export function useIonRouter(): UseIonRouterResult {
  const context = useContext(IonRouterContext)
  return React.useMemo(
    () => ({
      back: context.back,
      push: context.push,
      goBack: context.back,
      canGoBack: context.canGoBack,
      routeInfo: context.routeInfo,
    }),
    [context.back, context.canGoBack, context.push, context.routeInfo]
  )
}
