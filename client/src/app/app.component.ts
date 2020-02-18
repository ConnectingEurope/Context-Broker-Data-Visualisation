import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { LeafletIcons } from './shared/leaflet-icons';
import { LayerUtils } from './shared/layer-utils';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  protected menuItems: MenuItem[];
  protected layers: TreeNode[];
  protected selectedLayers: TreeNode[];

  private map: L.Map;
  private markerClusterGroup: L.MarkerClusterGroup;
  private layerGroups: { [key: string]: L.LayerGroup } = {};

  ngOnInit(): void {
    this.loadMenu();
    this.loadLayerMenu();
  }

  ngAfterViewInit(): void {
    this.loadMap();
    this.loadSearchBar();
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

  private loadSearchBar(): void {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      autoClose: true
    });

    this.map.addControl(searchControl);
  }

  private loadLayerMenu(): void {
    this.layers = LayerUtils.MAIN_LAYERS;
    this.selectedLayers = LayerUtils.ALL_LAYERS;
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

    this.layerGroups[LayerUtils.PARKING.data] = L.layerGroup([
      L.marker([40.08291075, -2.90053831], { icon: LeafletIcons.parkingIcon }),
      L.marker([41.52626661, -2.9284049], { icon: LeafletIcons.parkingIcon }),
      L.marker([41.35810746, -4.98297874], { icon: LeafletIcons.parkingIcon })
    ]);

    this.layerGroups[LayerUtils.BIKE_STATION.data] = L.layerGroup([
      L.marker([42.04885002, -3.47299921], { icon: LeafletIcons.bikeStationIcon }),
      L.marker([40.52178249, -4.33102401], { icon: LeafletIcons.bikeStationIcon }),
      L.marker([39.31765313, -2.76396301], { icon: LeafletIcons.bikeStationIcon })
    ]);

    this.layerGroups[LayerUtils.BUS.data] = L.layerGroup([
      L.marker([41.23286395, -4.14979341], { icon: LeafletIcons.busIcon }),
      L.marker([40.69900607, -4.63539567], { icon: LeafletIcons.busIcon }),
      L.marker([41.80582574, -3.4261288], { icon: LeafletIcons.busIcon })
    ]);

    this.layerGroups[LayerUtils.TRANSPORT.data] = L.layerGroup([
      this.layerGroups[LayerUtils.PARKING.data],
      this.layerGroups[LayerUtils.BIKE_STATION.data],
      this.layerGroups[LayerUtils.BUS.data]
    ]);

    Object.values(this.layerGroups).forEach(lg => {
      this.markerClusterGroup.addLayer(lg);
    });

    this.map.addLayer(this.markerClusterGroup);
  }

}
