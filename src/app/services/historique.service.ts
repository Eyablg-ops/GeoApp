import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore, collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy, limit, Timestamp,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface Entree {
  id?: string;
  type: 'position' | 'distance';
  latitude: number;
  longitude: number;
  distance?: number; // Distance en mètres
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class HistoriqueService {
  private db = initializeFirestore(initializeApp(environment.firebaseConfig), {
    // Long-polling automatique : maintient une connexion fiable dans les WebViews mobile.
    experimentalAutoDetectLongPolling: true,
  });
  private col = collection(this.db, 'historique');

  async ajouter(e: Omit<Entree, 'id' | 'date'>) {
    await addDoc(this.col, { ...e, date: Timestamp.now() });
  }

  async lister(): Promise<Entree[]> {
    const snap = await getDocs(query(this.col, orderBy('date', 'desc'), limit(50)));
    return snap.docs.map((d) => {
      const data: any = d.data();
      return { id: d.id, ...data, date: data.date.toDate() } as Entree;
    });
  }

  async supprimer(id: string) {
    await deleteDoc(doc(this.db, 'historique', id));
  }
}