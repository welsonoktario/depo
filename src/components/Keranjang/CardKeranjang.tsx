import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonText,
} from '@ionic/react'
import { add, remove } from 'ionicons/icons'
import React from 'react'
import { CartItem } from '../../models'

export const CardKeranjang: React.FC<{
  cartItem: CartItem
  onEditClick: (id: number, tipe: 'inc' | 'dec') => void
  onHapusClick: (id: number) => void
}> = ({ cartItem, onEditClick, onHapusClick }) => {
  return (
    <IonItemSliding>
      <IonItem>
        <IonAvatar slot="start" className="ion-margin-start">
          <img
            src={
              cartItem.barang.gambar ||
              `https://ui-avatars.com/api/?name=${cartItem.barang.nama}`
            }
            alt={cartItem.barang.nama}
          />
        </IonAvatar>
        <IonLabel className="ion-margin-start">{cartItem.barang.nama}</IonLabel>
        <div className="flex-col items-center" slot="end">
          <IonText style={{ margin: 0 }} color="primary">
            <h6>
              {'Rp ' +
                (cartItem.jumlah * cartItem.barang.harga).toLocaleString(
                  'id-ID'
                )}
            </h6>
          </IonText>
          <div
            className="inline-flex items-center justify-center"
            style={{ marginTop: '8px', width: '100%' }}
          >
            <IonButton
              fill="clear"
              shape="round"
              className="ion-no-padding"
              onClick={() => {
                if (cartItem.jumlah > cartItem.barang.minPembelian) {
                  onEditClick(cartItem.barang.id, 'dec')
                }
              }}
            >
              <IonIcon slot="icon-only" icon={remove}></IonIcon>
            </IonButton>
            <IonInput
              style={{ width: '40px', textAlign: 'center' }}
              min="1"
              value={cartItem.jumlah}
              type="number"
            ></IonInput>
            <IonButton
              fill="clear"
              shape="round"
              className="ion-no-padding"
              onClick={() => onEditClick(cartItem.barang.id, 'inc')}
            >
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </div>
        </div>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption
          color="danger"
          onClick={() => onHapusClick(cartItem.barang.id)}
        >
          Hapus
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  )
}
