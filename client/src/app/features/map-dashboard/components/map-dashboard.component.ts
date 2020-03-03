import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { LeafletIcons } from '../../../shared/misc/leaflet-icons';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapDashboardService } from '../services/map-dashboard-service/map-dashboard.service';
import { LayerService } from '../services/layer-service/layer-service';
import { PopupService } from '../services/popup-service/popup-service';
import { Entity } from 'src/app/shared/data-models/fiware/entity';
import { ModelDto } from 'src/app/shared/misc/model-dto';

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
  ) { }

  public ngOnInit(): void {
    this.loadLayerMenu();
  }

  public ngAfterViewInit(): void {
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
    const searchControl: GeoSearchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      autoClose: true,
    });

    this.map.addControl(searchControl);
  }

  private loadLayerMenu(): void {
    this.layers = this.layerService.getMainLayers();
    this.selectedLayers = this.layerService.getAllLayers(this.layers);
  }

  private loadEntities(): void {
    this.mapDashBoardService.getAllEntities().subscribe((res: ModelDto[]) => {

      res.forEach(model => {
        this.layerGroups[model.key] = L.layerGroup();
        this.layerGroups[model.parentKey] = this.layerGroups[model.parentKey] || L.layerGroup();
        model.data.forEach(entity => this.addEntity(model, entity));
        this.layerGroups[model.parentKey].addLayer(this.layerGroups[model.key]);
      });

      this.loadMarkerCluster();
    });
  }

  private addEntity(model: ModelDto, entity: Entity): void {
    const marker: L.Marker = L.marker(entity.location.coordinates as L.LatLngExpression, { icon: LeafletIcons.icons[model.key] });
    marker.bindPopup(this.popupService.getPopup(model.key, entity));
    this.layerGroups[model.key].addLayer(marker);
  }

  private loadMarkerCluster(): void {
    Object.values(this.layerGroups).forEach(lg => {
      this.markerClusterGroup.addLayer(lg);
    });

    this.map.addLayer(this.markerClusterGroup);
  }

}