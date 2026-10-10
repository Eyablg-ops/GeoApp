import { Component, signal, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonButton, IonSpinner,
} from '@ionic/angular';
import { Entree, HistoriqueService } from '../services/historique.service';

@Component({
  selector: 'app-historique',
  templateUrl: 'historique.page.html',
  styleUrls: ['historique.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonButton, IonSpinner,
  ],
})
export class HistoriquePage {
      private historique = inject(HistoriqueService);
      entrees = signal<Entree[]>([]);
  chargement = signal(false);
  erreur = signal('');
  // Cycle de vie Ionic : exécuté à chaque entrée sur la page.
  ionViewWillEnter() {
    this.charger();
  }

  async charger() {
    this.chargement.set(true);
    this.erreur.set('');
    try {
      this.entrees.set(await this.historique.lister());
    } catch {
      this.erreur.set('Impossible de lire Firebase.');
    } finally {
      this.chargement.set(false);
    }
  }

  async supprimer(id: string) {
    await this.historique.supprimer(id);
    this.entrees.update((liste) => liste.filter((e) => e.id !== id));
  }
}