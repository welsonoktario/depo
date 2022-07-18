import { Http } from '@capacitor-community/http'
import { modalController } from '@ionic/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { close } from 'ionicons/icons'
// @ts-ignore
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FC, useEffect, useRef, useState } from 'react'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'
import './ModalPilihLokasi.css'

const ACCESS_TOKEN =
  'pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg'
mapboxgl.workerClass = MapboxWorker

export const ModalPilihLokasi: FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const geocoder = useRef<MapboxGeocoder | null>(null)
  const geolocate = useRef<mapboxgl.GeolocateControl | null>()
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [alamat, setAlamat] = useState('')

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      accessToken: ACCESS_TOKEN,
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [112.7126837, -7.2756195],
      zoom: 13,
    })

    geocoder.current = new MapboxGeocoder({
      accessToken: ACCESS_TOKEN,
      marker: false,
      countries: 'id',
      language: 'ID',
      placeholder: 'Cari alamat',
    })

    geolocate.current = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })

    map.current.addControl(geocoder.current, 'top-left')
    map.current.addControl(geolocate.current, 'bottom-right')

    map.current.on('load', () => {
      map.current?.resize()
      geolocate.current?.trigger()
    })
    map.current.on('click', getClickLocation)
    geocoder.current.on('result', getGeocoderLocation)
  })

  const getClickLocation = async (e: mapboxgl.MapMouseEvent) => {
    const lngLat = e.lngLat

    if (marker.current) {
      marker.current.setLngLat(lngLat)
    } else {
      marker.current = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map.current as mapboxgl.Map)
    }

    map.current?.flyTo({
      center: marker.current.getLngLat(),
      essential: true,
      zoom: 16,
    })

    await reverseGeocode(lngLat)
  }

  const getGeocoderLocation = async (e: any) => {
    const lngLat = e.result.center as mapboxgl.LngLat

    if (marker.current) {
      marker.current.setLngLat(lngLat)
    } else {
      marker.current = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map.current as mapboxgl.Map)
    }

    await reverseGeocode(lngLat)
  }

  const reverseGeocode = async (lngLat: mapboxgl.LngLat) => {
    const latLng = lngLat.toArray().join(',')
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${latLng}.json?access_token=${ACCESS_TOKEN}&types=postcode,district,address,poi`
    const res = await Http.get({
      url,
      headers: {
        Accept: 'application/json',
      },
    })
    const { data } = res
    const json = JSON.parse(data)

    if (json.features.length) {
      setAlamat(json.features[0].place_name)
    }
  }

  const cancel = async () => {
    await modalController.dismiss(undefined)
  }

  const pilih = async () => {
    if (marker.current && alamat) {
      await modalController.dismiss({
        lokasi: marker.current.getLngLat(),
        alamat,
      })
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => cancel()}>
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

      <IonFooter className="ion-padding">
        {alamat ? (
          <IonText>
            <p>{alamat}</p>
          </IonText>
        ) : null}
        <IonButton expand="block" onClick={() => pilih()}>
          Pilih
        </IonButton>
      </IonFooter>
    </>
  )
}
