import { modalController } from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { close } from 'ionicons/icons'
// @ts-ignore
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp'
import { FC, useEffect, useRef } from 'react'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

const ACCESS_TOKEN =
  'pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg'
mapboxgl.workerClass = MapboxWorker

export const ModalPengiriman: FC<{ lokasi: mapboxgl.LngLat }> = (props) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      accessToken: ACCESS_TOKEN,
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [112.7126837, -7.2756195],
      zoom: 13,
    })

    map.current.on('load', () => {
      map.current?.resize()
    })

    marker.current = new mapboxgl.Marker()
      .setLngLat(props.lokasi)
      .addTo(map.current as mapboxgl.Map)

    map.current?.flyTo({
      center: props.lokasi,
      essential: true,
      zoom: 15,
    })
  })

  const cancel = async () => {
    await modalController.dismiss(undefined)
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={cancel}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Alamat Kirim</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="map-container">
          <div ref={mapContainer} className="map" />
        </div>
      </IonContent>
    </>
  )
}
