import { Component, OnDestroy, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { RouterLink } from '@angular/router';
import { HistoriqueService } from '../services/historique.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    RouterLink,        
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
  providers: [Geolocation],
})
export class HomePage implements OnDestroy {
  private geolocation = inject(Geolocation);
  private historique = inject(HistoriqueService);

  position: any = null;
  erreur = '';
  chargement = false;
  nbPositions = 0;
  dureeSuivi = 0;
  private watchId: any = null;
  private timer: any = null;

  async obtenirPositionPonctuelle() {
    this.chargement = true;
    this.erreur = '';
    try {
      const pos = await this.geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      this.position = pos.coords;
      this.historique
  .ajouter({ type: 'position', latitude: pos.coords.latitude, longitude: pos.coords.longitude })
  .catch((err) => console.error('Firebase :', err));
    } catch (e: any) {
      this.erreur = this.messageErreur(e);
    } finally {
      this.chargement = false;
    }
  }

  demarrerSuivi() {
    this.arreterSuivi();
    this.nbPositions = 0;
    this.dureeSuivi = 0;
    this.erreur = '';
    this.chargement = true;

    this.timer = setInterval(() => this.dureeSuivi++, 1000);

    this.watchId = this.geolocation
      .watchPosition({ enableHighAccuracy: true })
      .subscribe({
        next: (pos: any) => {
          if (pos.coords) {
            this.position = pos.coords;
            this.nbPositions++;
            this.chargement = false;
          } else {
            this.erreur = this.messageErreur(pos);
          }
        },
        error: (e) => {
          this.erreur = this.messageErreur(e);
          this.chargement = false;
        },
      });
  }

  arreterSuivi() {
    if (this.watchId) {
      this.watchId.unsubscribe();
      this.watchId = null;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.chargement = false;
  }

  private messageErreur(e: any): string {
    switch (e?.code) {
      case 1: return 'Permission refusée';
      case 2: return 'Position indisponible';
      case 3: return 'Délai dépassé (timeout)';
      default: return 'Erreur inconnue';
    }
  }

  ngOnDestroy() {
    this.arreterSuivi();
  }
}