import { Injectable } from '@angular/core';
import { MapDashboardComponent } from '../components/map-dashboard.component';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';

@Injectable({
    providedIn: 'root',
})
export class MapLoadService {

    public mapDashboardComponent: MapDashboardComponent;

    private loadMap(): void {

        this.mapDashboardComponent.map = L.map('map', {
            center: [50.85045, 4.34878],
            zoom: this.mapDashboardComponent.defaultZoom,
            minZoom: 3,
            maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
            maxBoundsViscosity: 0.5,
            doubleClickZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.mapDashboardComponent.map);

        this.mapDashboardComponent.map.addLayer(this.mapDashboardComponent.markerClusterGroup);

        this.mapDashboardComponent.map.on('zoomstart', (event) => {
            this.mapDashboardComponent.markerClusterGroup.getLayers().forEach(l => {
                if (l.getTooltip()) {
                    const elements: NodeList = this.mapDashboardComponent.elem.nativeElement.querySelectorAll('.leaflet-tooltip-pane');
                    elements.forEach((e: HTMLElement) => e.style.display = 'none');
                }
            });
        });

        this.mapDashboardComponent.markerClusterGroup.on('animationend', () => {
            this.mapDashboardComponent.markerClusterGroup.getLayers().forEach(l => {
                this.mapDashboardComponent.openTooltip(l as L.Marker);
            });
        });

    }

}
