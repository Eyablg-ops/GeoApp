import { Component, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent,
} from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import * as L from 'leaflet';
import { HistoriqueService } from '../services/historique.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardContent],
  providers: [Geolocation],
})
export class MapPage implements AfterViewInit, OnDestroy {
  private geolocation = inject(Geolocation);
  private historique = inject(HistoriqueService);

  message = signal('Localisation en cours...');
  private map?: L.Map;
  private maPosition?: L.LatLng;
  private cible?: L.CircleMarker;
  private ligne?: L.Polyline;


  async ngAfterViewInit() {
    const map = L.map('map').setView([0, 0], 2);
    this.map = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => this.calculerDistance(e.latlng));
    // Recalcule les dimensions du conteneur une fois le rendu terminé.
    setTimeout(() => map.invalidateSize(), 300);

    await this.localiser();
  }

  private async localiser() {
    try {
      const pos = await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      this.maPosition = L.latLng(pos.coords.latitude, pos.coords.longitude);
      L.circleMarker(this.maPosition, { radius: 10, color: '#2563eb', fillOpacity: 0.9 })
        .addTo(this.map!)
        .bindPopup('Ma position');
      this.map!.setView(this.maPosition, 15);
      this.message.set('Touchez la carte pour mesurer une distance.');
    } catch {
      this.message.set('Position indisponible.');
    }
  }

  private calculerDistance(cible: L.LatLng) {
    if (!this.maPosition || !this.map) return;

    this.cible?.remove();
    this.ligne?.remove();
    this.cible = L.circleMarker(cible, { radius: 8, color: '#dc2626', fillOpacity: 0.9 }).addTo(this.map);
    this.ligne = L.polyline([this.maPosition, cible], { color: '#dc2626', dashArray: '6' }).addTo(this.map);

    const metres = this.map.distance(this.maPosition, cible);
    this.message.set(
      'Distance : ' + (metres < 1000 ? Math.round(metres) + ' m' : (metres / 1000).toFixed(2) + ' km')
    );

    this.historique
      .ajouter({ type: 'distance', latitude: cible.lat, longitude: cible.lng, distance: Math.round(metres) })
      .catch((err) => console.error('Firebase :', err));
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}