import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';

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

  ngOnInit() {
    this.items = [
      {
        label: 'Map',
        icon: 'pi pi-map-marker'
      },
      {
        label: 'Graphs',
        icon: 'pi pi-desktop'
      }
    ];

    this.layers = [
      {
        label: 'Transport',
        children: [
          { label: 'Parkings' },
          { label: 'Bikes' },
          { label: 'Bus' }
        ]
      }
    ];
  }

  ngAfterViewInit(): void {

    const map = L.map('map', {
      center: [51.5, -0.09],
      zoom: 4
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(map);
    const markers = L.markerClusterGroup();
    markers.addLayer(L.marker([51.5, -0.09]));
    markers.addLayer(L.marker([58.5, -0.03]));
    markers.addLayer(L.marker([45.5, -0.12]));
    map.addLayer(markers);
  }

  onListClicked() {
    this.sidebarVisible = true;
  }

}
