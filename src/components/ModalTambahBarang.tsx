import { modalController } from "@ionic/core";
import { IonBackButton, IonButton, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { cartAtom } from "../atoms";
import { Barang } from "../models";

const ModalTambahBarang: React.FC<{ barang: Barang }> = (props) => {
  const [jumlah, setJumlah] = useState(1)
  const [cart, setCart] = useAtom(cartAtom)

  const addToCart = async (barang: Barang) => {
    const exist = cart.findIndex((item) => item.barang.id === barang.id)

    if (exist !== -1) {
      const newCart = [...cart]
      newCart[exist].jumlah += jumlah
      setCart(newCart)
    } else {
      setCart([...cart, { barang, jumlah }])
    }
    await modalController.dismiss()
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonBackButton></IonBackButton>
          <IonTitle>Tambah ke Keranjang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Jumlah</IonLabel>
          <IonInput type="number" placeholder="Jumlah" value={jumlah} onIonChange={(e) => setJumlah(e.target.value as number)}></IonInput>
        </IonItem>
        <IonItem>
          <IonText>
            Subtotal: {props.barang.harga * jumlah}
          </IonText>
        </IonItem>
      </IonContent>

      <IonFooter>
        <IonButton onClick={() => addToCart(props.barang)}>Tambah</IonButton>
      </IonFooter>
    </>
  )
}

export default ModalTambahBarang