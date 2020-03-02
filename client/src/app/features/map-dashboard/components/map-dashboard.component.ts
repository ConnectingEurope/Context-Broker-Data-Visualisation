import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import { LayerUtils } from '../../../shared/layer-utils';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { LeafletIcons } from '../../../shared/leaflet-icons';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapDashboardService } from '../services/map-dashboard-service/map-dashboard.service';
import { AirQualityObserved } from '../../../shared/data-models/air-quality-observed';
import { LatLngTuple } from 'leaflet';
import * as moment from 'moment';
import { LayerService } from '../services/layer-service/layer-service';
import { PopupService } from '../services/popup-service/popup-service';

@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent implements OnInit, AfterViewInit {

  protected menuItems: MenuItem[];
  protected layers: TreeNode[];
  protected selectedLayers: TreeNode[];

  private map: L.Map;
  private markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup();
  private layerGroups: { [key: string]: L.LayerGroup } = {};

  constructor(
    private mapDashBoardService: MapDashboardService,
    private layerService: LayerService,
    private popupService: PopupService,
  ) {

  }

  ngOnInit(): void {
    this.loadLayerMenu();
  }

  ngAfterViewInit(): void {
    this.loadMap();
    this.loadSearchBar();
    this.loadEntities();
  }

  protected onNodeSelect(event: any): void {
    this.markerClusterGroup.addLayer(this.layerGroups[event.node.data]);
  }

  protected onNodeUnselect(event: any): void {
    this.markerClusterGroup.removeLayer(this.layerGroups[event.node.data]);
  }

  private loadMap(): void {
    this.map = L.map('map', {
      center: [40.416775, -3.703790],
      zoom: 4,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  private loadSearchBar(): void {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      autoClose: true,
    });

    this.map.addControl(searchControl);
  }

  private loadLayerMenu(): void {
    this.layers = this.layerService.getMainLayers();
    this.selectedLayers = this.layerService.getAllLayers(this.layers);
  }

  // private loadMarkers(): void {

  //   const samples = 500;

  //   this.generateRandomLocations(LayerUtils.PARKING.data, LeafletIcons.parkingIcon, samples);
  //   this.generateRandomLocations(LayerUtils.BIKE_STATION.data, LeafletIcons.bikeStationIcon, samples);
  //   this.generateRandomLocations(LayerUtils.BUS.data, LeafletIcons.busIcon, samples);

  //   this.layerGroups[LayerUtils.TRANSPORT.data] = L.layerGroup([
  //     this.layerGroups[LayerUtils.PARKING.data],
  //     this.layerGroups[LayerUtils.BIKE_STATION.data],
  //     this.layerGroups[LayerUtils.BUS.data],
  //   ]);

  //   this.refreshLayers();

  //   this.map.addLayer(this.markerClusterGroup);
  // }

  private loadEntities(): void {

    this.mapDashBoardService.getAllEntities().subscribe((res: any[]) => {

      res.forEach(m => {
        this.layerGroups[m.parentKey] = L.layerGroup();
        this.layerGroups[m.modelKey] = L.layerGroup();

        m.data.forEach(e => {
          const marker = L.marker(e.location.coordinates, { icon: LeafletIcons.icons[m.modelKey] });
          marker.bindPopup(this.popupService.getPopup(m.modelKey, e));
          this.layerGroups[m.modelKey].addLayer(marker);
        });

        this.layerGroups[m.parentKey].addLayer(this.layerGroups[m.modelKey]);
      });
    });

    Object.values(this.layerGroups).forEach(lg => {
      this.markerClusterGroup.addLayer(lg);
    });

    this.map.addLayer(this.markerClusterGroup);
  }

  // private refreshLayers(): void {
  //   Object.values(this.layerGroups).forEach(lg => {
  //     this.markerClusterGroup.addLayer(lg);
  //   });
  // }

  // private generateRandomLocations(layer: any, iconLayer: L.Icon, samples: number) {
  //   let count: number = samples;
  //   this.layerGroups[layer] = L.layerGroup();
  //   while (count > 0) {
  //     const randomLatLon: L.LatLngTuple = this.generateRandomLatLon();
  //     const marker = L.marker(randomLatLon, { icon: iconLayer });
  //     marker.bindPopup(this.showEntityPopup(randomLatLon));
  //     this.layerGroups[layer].addLayer(marker);
  //     count--;
  //   }
  // }

  // private generateRandomLatLon(): LatLngTuple {
  //   const lat: number = this.randomFromInterval(37.890676, 42.897983);
  //   const lon: number = this.randomFromInterval(-8.246180, -1.150096);
  //   return [lat, lon];
  // }

  // private randomFromInterval(min: number, max: number) {
  //   return Math.random() * (max - min) + min;
  // }

  // private showAirQualityObservedPopup(e: AirQualityObserved): string {
  //   return '<b>Latitude: </b>' + e.latitude + '<br />' +
  //     '<b>Longitude: </b>' + e.longitude + '<br />' +
  //     '<b>NO: </b>' + (Number(e.NO) ? e.NO : '-') + '<br />' +
  //     '<b>NO2: </b>' + (Number(e.NO2) ? e.NO2 : '-') + '<br />' +
  //     '<b>O3: </b>' + (Number(e.O3) ? e.O3 : '-') + '<br />' +
  //     '<b>Date: </b>' + moment(e.TimeInstant).format('DD/MM/YYYY, h:mm:ss a');
  // }

  // private showEntityPopup(e: L.LatLngTuple): string {
  //   return '<b>Latitude: </b>' + e[0].toFixed(5) + '<br />' +
  //     '<b>Longitude: </b>' + e[1].toFixed(5) + '<br />';
  // }

}
