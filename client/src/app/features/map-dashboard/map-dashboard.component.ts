import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import { LayerUtils } from '../../shared/layer-utils';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { LeafletIcons } from '../../shared/leaflet-icons';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapDashboardService } from './map-dashboard.service';
import { AirQualityObserved } from '../../shared/data-models/air-quality-observed';
import { LatLngTuple } from 'leaflet';
import * as moment from 'moment';

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
  private markerClusterGroup: L.MarkerClusterGroup;
  private layerGroups: { [key: string]: L.LayerGroup } = {};

  constructor(private mapDashBoardService: MapDashboardService) {

  }

  ngOnInit(): void {
    this.loadLayerMenu();
    this.loadEntities();
  }

  ngAfterViewInit(): void {
    this.loadMap();
    this.loadSearchBar();
    // this.loadMarkers();
  }

  protected onNodeSelect(event: any): void {
    this.markerClusterGroup.addLayer(this.layerGroups[event.node.data]);
  }

  protected onNodeUnselect(event: any): void {
    this.markerClusterGroup.removeLayer(this.layerGroups[event.node.data]);
  }

  private loadSearchBar(): void {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      autoClose: true,
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
      zoom: 4,
    });

    this.markerClusterGroup = L.markerClusterGroup();

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
  }

  private loadMarkers(): void {

    const samples = 500;

    this.generateRandomLocations(LayerUtils.PARKING.data, LeafletIcons.parkingIcon, samples);
    this.generateRandomLocations(LayerUtils.BIKE_STATION.data, LeafletIcons.bikeStationIcon, samples);
    this.generateRandomLocations(LayerUtils.BUS.data, LeafletIcons.busIcon, samples);

    this.layerGroups[LayerUtils.TRANSPORT.data] = L.layerGroup([
      this.layerGroups[LayerUtils.PARKING.data],
      this.layerGroups[LayerUtils.BIKE_STATION.data],
      this.layerGroups[LayerUtils.BUS.data],
    ]);

    this.refreshLayers();

    this.map.addLayer(this.markerClusterGroup);
  }

  private loadEntities(): void {
    this.mapDashBoardService.getAirQualityObservedEntities().subscribe((res: AirQualityObserved[]) => {
      this.layerGroups[LayerUtils.AIR_QUALITY.data] = L.layerGroup();
      res.forEach(e => {
        const marker = L.marker([e.latitude, e.longitude], { icon: LeafletIcons.airQualityIcon });
        marker.bindPopup(this.showAirQualityObservedPopup(e));
        this.layerGroups[LayerUtils.AIR_QUALITY.data].addLayer(marker);
      });
      this.layerGroups[LayerUtils.ENVIRONMENT.data] = L.layerGroup([
        this.layerGroups[LayerUtils.AIR_QUALITY.data],
      ]);
      // this.refreshLayers();
      this.loadMarkers();
    });
  }

  private refreshLayers(): void {
    Object.values(this.layerGroups).forEach(lg => {
      this.markerClusterGroup.addLayer(lg);
    });
  }

  private generateRandomLocations(layer: any, iconLayer: L.Icon, samples: number) {
    let count: number = samples;
    this.layerGroups[layer] = L.layerGroup();
    while (count > 0) {
      const randomLatLon: L.LatLngTuple = this.generateRandomLatLon();
      const marker = L.marker(randomLatLon, { icon: iconLayer });
      marker.bindPopup(this.showEntityPopup(randomLatLon));
      this.layerGroups[layer].addLayer(marker);
      count--;
    }
  }

  private generateRandomLatLon(): LatLngTuple {
    const lat: number = this.randomFromInterval(37.890676, 42.897983);
    const lon: number = this.randomFromInterval(-8.246180, -1.150096);
    return [lat, lon];
  }

  private randomFromInterval(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private showAirQualityObservedPopup(e: AirQualityObserved): string {
    return '<b>Latitude: </b>' + e.latitude + '<br />' +
      '<b>Longitude: </b>' + e.longitude + '<br />' +
      '<b>NO: </b>' + (Number(e.NO) ? e.NO : '-') + '<br />' +
      '<b>NO2: </b>' + (Number(e.NO2) ? e.NO2 : '-') + '<br />' +
      '<b>O3: </b>' + (Number(e.O3) ? e.O3 : '-') + '<br />' +
      '<b>Date: </b>' + moment(e.TimeInstant).format('DD/MM/YYYY, h:mm:ss a');
  }

  private showEntityPopup(e: L.LatLngTuple): string {
    return '<b>Latitude: </b>' + e[0].toFixed(5) + '<br />' +
      '<b>Longitude: </b>' + e[1].toFixed(5) + '<br />';
  }

}
