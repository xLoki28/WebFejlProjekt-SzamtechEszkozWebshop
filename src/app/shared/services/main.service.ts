import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../models/Device';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'

@Injectable({
  providedIn: 'root'
})
export class MainService {

  collectionName = 'Items'

  constructor(private http: HttpClient, private afs: AngularFirestore, private storage: AngularFireStorage) { }

  loadImageMeta(metaUrl: string): Observable<Array<Device>> {
    return this.afs.collection<Device>(this.collectionName).valueChanges();
  }

  loadImage(imageUrl: string): Observable<string> {
    const storageRef = this.storage.ref(imageUrl);
    return storageRef.getDownloadURL();
  }

  getDeviceById(deviceId: string): Observable<Device> {
    return this.afs.collection<Device>(this.collectionName).doc(deviceId).valueChanges() as Observable<Device>;
  }
}
