import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'CB-Baseline';

  items: MenuItem[];
  layers: TreeNode[] = [{ label: 'Transport', children: [{ label: 'Bikes' }, { label: 'Cars' }] }];
  selectedLayers: TreeNode[];

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

}
