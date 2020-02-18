import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { LeafletIcons } from './shared/leaflet-icons';
import { Layer } from './shared/layer-group-registry.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  protected menuItems: MenuItem[];
  protected layers: TreeNode[];
  protected selectedLayers: TreeNode[];

  private layerGroups: { [key: string]: L.LayerGroup } = {};
  private map: L.Map;
  private markerClusterGroup: L.MarkerClusterGroup;

  ngOnInit(): void {
    this.loadMenu();
    this.loadLayers();
  }

  ngAfterViewInit(): void {
    this.loadMap();
    this.loadMarkers();
  }

  protected onNodeSelect(event: any): void {
    this.markerClusterGroup.addLayer(this.layerGroups[event.node.data]);
  }

  protected onNodeUnselect(event: any): void {
    this.markerClusterGroup.removeLayer(this.layerGroups[event.node.data]);
  }

  private loadMenu(): void {
    this.menuItems = [
      { label: 'Map', icon: 'pi pi-map-marker' },
      { label: 'Graphs', icon: 'pi pi-desktop' }
    ];
  }

  private loadLayers(): void {
    this.layers = [
      {
        data: Layer.TRANSPORT.key,
        label: Layer.TRANSPORT.value,
        children: [
          { data: Layer.PARKING.key, label: Layer.PARKING.value },
          { data: Layer.BIKE_STATION.key, label: Layer.BIKE_STATION.value },
          { data: Layer.BUS.key, label: Layer.BUS.value }
        ]
      }
    ];
  }

  private loadMap(): void {

    this.map = L.map('map', {
      center: [40.416775, -3.703790],
      zoom: 6
    });

    this.markerClusterGroup = L.markerClusterGroup();

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private loadMarkers(): void {

    this.layerGroups[Layer.PARKING.key] = L.layerGroup([
      L.marker([40.08291075, -2.90053831], { icon: LeafletIcons.parkingIcon }),
      L.marker([41.52626661, -2.9284049], { icon: LeafletIcons.parkingIcon }),
      L.marker([41.35810746, -4.98297874], { icon: LeafletIcons.parkingIcon })
    ]);

    this.layerGroups[Layer.BIKE_STATION.key] = L.layerGroup([
      L.marker([42.04885002, -3.47299921], { icon: LeafletIcons.bikeStationIcon }),
      L.marker([40.52178249, -4.33102401], { icon: LeafletIcons.bikeStationIcon }),
      L.marker([39.31765313, -2.76396301], { icon: LeafletIcons.bikeStationIcon })
    ]);

    this.layerGroups[Layer.BUS.key] = L.layerGroup([
      L.marker([41.23286395, -4.14979341], { icon: LeafletIcons.busIcon }),
      L.marker([40.69900607, -4.63539567], { icon: LeafletIcons.busIcon }),
      L.marker([41.80582574, -3.4261288], { icon: LeafletIcons.busIcon })
    ]);

    this.layerGroups[Layer.TRANSPORT.key] = L.layerGroup([
      this.layerGroups[Layer.PARKING.key],
      this.layerGroups[Layer.BIKE_STATION.key],
      this.layerGroups[Layer.BUS.key]
    ]);

    // Object.values(this.layerGroups).forEach(lg => {
    //   this.markerClusterGroup.addLayer(lg);
    // });

    this.map.addLayer(this.markerClusterGroup);

    // this.markerClusterGroup.removeLayer(this.layerGroups[Layer.BUS.key]);
  }

}
