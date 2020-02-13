import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { LeafletIcons } from './shared/leaflet-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  protected items: MenuItem[];
  protected layers: TreeNode[];
  protected selectionLayers: TreeNode[];
  protected sidebarVisible: boolean;
  private map: L.Map;

  ngOnInit(): void {
    this.loadMenu();
    this.loadLayers();
  }

  ngAfterViewInit(): void {
    this.loadMap();
    this.loadMarkers();
  }

  private loadMenu(): void {
    this.items = [
      { label: 'Map', icon: 'pi pi-map-marker' },
      { label: 'Graphs', icon: 'pi pi-desktop' }
    ];
  }

  private loadLayers(): void {
    this.layers = [
      {
        label: 'Transport',
        children: [
          { label: 'Parkings' },
          { label: 'Bike stations' },
          { label: 'Buses' }
        ]
      }
    ];
  }

  private loadMap(): void {
    this.map = L.map('map', {
      center: [40.416775, -3.703790],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private loadMarkers(): void {
    const markers = L.markerClusterGroup();
    markers.addLayer(L.marker([40.08291075, -2.90053831], { icon: LeafletIcons.parkingIcon }));
    markers.addLayer(L.marker([41.52626661, -2.9284049], { icon: LeafletIcons.parkingIcon }));
    markers.addLayer(L.marker([41.35810746, -4.98297874], { icon: LeafletIcons.parkingIcon }));
    markers.addLayer(L.marker([42.04885002, -3.47299921], { icon: LeafletIcons.stationBikeIcon }));
    markers.addLayer(L.marker([40.52178249, -4.33102401], { icon: LeafletIcons.stationBikeIcon }));
    markers.addLayer(L.marker([39.31765313, -2.76396301], { icon: LeafletIcons.stationBikeIcon }));
    markers.addLayer(L.marker([41.23286395, -4.14979341], { icon: LeafletIcons.busIcon }));
    markers.addLayer(L.marker([40.69900607, -4.63539567], { icon: LeafletIcons.busIcon }));
    markers.addLayer(L.marker([41.80582574, -3.4261288], { icon: LeafletIcons.busIcon }));
    this.map.addLayer(markers);
  }

}
