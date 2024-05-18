import { Injectable } from '@angular/core';
import { CartItem } from '../models/CartItem';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  collectionName = 'CartItems'

  constructor(private afs: AngularFirestore) { }

  create(cartItem: CartItem) {
    return this.afs.collection<CartItem>(this.collectionName).add(cartItem);
  }

  getAllByUserId() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (user){
      return this.afs.collection<CartItem>(this.collectionName, ref => ref.where('userId', '==', user.uid as string)).valueChanges();
    } else {
      return of([] as CartItem[]);
    }
  }

  async update(cartItem: CartItem) {
    try {
      const querySnapshot = await firstValueFrom(
        this.afs.collection<CartItem>(this.collectionName, ref => 
          ref.where('userId', '==', cartItem.userId)
             .where('itemId', '==', cartItem.itemId)
        ).get()
      );
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await this.afs.collection<CartItem>(this.collectionName).doc(docId).update({
          cartedCount: cartItem.cartedCount + 1
        });
        console.log('CartItem updated successfully!');
      } else {
        console.log('No matching CartItem found to update.');
      }
    } catch (error) {
      console.error('Error updating CartItem:', error);
    }
  }

  async delete(cartItem: CartItem) {
    try {
      const querySnapshot = await firstValueFrom(
        this.afs.collection<CartItem>(this.collectionName, ref => 
          ref.where('userId', '==', cartItem.userId)
             .where('itemId', '==', cartItem.itemId)
        ).get()
      );
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await this.afs.collection<CartItem>(this.collectionName).doc(docId).delete();
        console.log('CartItem deleted successfully!');
      } else {
        console.log('No matching CartItem found to delete.');
      }
    } catch (error) {
      console.error('Error deleting CartItem:', error);
    }
  }
}
