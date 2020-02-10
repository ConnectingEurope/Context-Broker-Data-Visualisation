import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api';
import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';

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

  }

  ngAfterViewInit(): void {

    const map = L.map('map', {
      center: [40.4167, -3.70325],
      zoom: 11
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(map);
  }

}
