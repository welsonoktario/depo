import { Http } from '@capacitor-community/http'
import {
  IonModalCustomEvent,
  modalController,
  OverlayEventDetail,
} from '@ionic/core'
import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { add, close as closeIcon } from 'ionicons/icons'
import { useAtom, useAtomValue } from 'jotai'
import { FC, useState } from 'react'
import { alamatAtom, authAtom } from '../../atoms'
import { Alamat } from '../../models'
import { ModalEditAlamat } from '../Alamat/ModalEditAlamat'
import { ModalTambahAlamat } from '../Alamat/ModalTambahAlamat'
import { CardAlamat } from './Alamat/CardAlamat'

const BASE_URL = process.env.REACT_APP_API_URL

export const ModalAlamat: FC = () => {
  const auth = useAtomValue(authAtom)
  const [alamats, setAlamats] = useAtom(alamatAtom)
  const [selected, setSelected] = useState<Alamat | null>(null)
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const close = async () => {
    await modalController.dismiss()
  }

  const closeModalTambah = async (
    e: IonModalCustomEvent<OverlayEventDetail<Alamat>>
  ) => {
    setIsModalTambahOpen(false)
    const data = e.detail.data

    if (data) {
      const oldAlamats = JSON.parse(JSON.stringify(alamats)) as Alamat[]
      oldAlamats.unshift(data)
      setAlamats(oldAlamats)
    }
  }

  const closeModalEdit = async (
    e: IonModalCustomEvent<OverlayEventDetail<Alamat>>
  ) => {
    setIsModalEditOpen(false)
    const data = e.detail.data

    if (data) {
      const oldAlamats = JSON.parse(JSON.stringify(alamats)) as Alamat[]

      if (data.isUtama) {
        oldAlamats.forEach((alamat, i) => {
          if (alamat.id === data.id) {
            oldAlamats[i] = data
          } else {
            alamat.isUtama = false
          }
        })
      } else {
        oldAlamats.forEach((alamat, i) => {
          if (alamat.id === data.id) {
            oldAlamats[i] = data
          }
          console.log(alamat)
        })
      }
      setAlamats(oldAlamats)
    }
  }

  const updateUtama = () => {
    Http.patch({
      url: BASE_URL + '/alamat/' + selected?.id + '/utama',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        isUtama: true,
      },
    })

    const oldAlamats = JSON.parse(JSON.stringify(alamats)) as Alamat[]
    oldAlamats.forEach((alamat) => {
      if (alamat.id === selected?.id) {
        alamat.isUtama = true
      } else {
        alamat.isUtama = false
      }
    })
    setAlamats(oldAlamats)
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={close}>
              <IonIcon slot="icon-only" icon={closeIcon}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Alamat</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsModalTambahOpen(true)}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Alamat</IonTitle>
          </IonToolbar>
        </IonHeader>

        {alamats ? (
          <IonList inset lines="none">
            {alamats.map((alamat) => (
              <CardAlamat
                alamat={alamat}
                key={alamat.id}
                onClick={(a) => {
                  setSelected(a)
                  setIsSheetOpen(true)
                }}
              />
            ))}
          </IonList>
        ) : null}

        <IonModal isOpen={isModalTambahOpen} onDidDismiss={closeModalTambah}>
          <ModalTambahAlamat />
        </IonModal>

        <IonModal isOpen={isModalEditOpen} onDidDismiss={closeModalEdit}>
          {selected ? <ModalEditAlamat alamat={selected} /> : null}
        </IonModal>

        {selected ? (
          <IonActionSheet
            isOpen={isSheetOpen}
            onDidDismiss={() => setIsSheetOpen(false)}
            buttons={[
              {
                text: 'Jadikan Alamat Utama',
                handler: updateUtama,
              },
              {
                text: 'Edit',
                handler: () => setIsModalEditOpen(true),
              },
            ]}
          ></IonActionSheet>
        ) : null}
      </IonContent>
    </>
  )
}
