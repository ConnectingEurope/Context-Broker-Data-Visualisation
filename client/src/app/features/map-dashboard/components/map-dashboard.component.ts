import { ConditionDto } from './../models/condition-dto';
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
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { Utilities } from '../../../shared/utils/utilities';

@Component({
    selector: 'app-map-dashboard',
    templateUrl: './map-dashboard.component.html',
    styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

    protected controlName: string = 'data';

    protected menuItems: MenuItem[];
    protected layers: TreeNode[];
    protected selectedLayers: TreeNode[];

    private map: L.Map;
    private markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup();
    private layerGroups: { [key: string]: L.LayerGroup } = {};
    private layersBeforeFilter: L.Layer[];
    private removedLayers: L.Layer[] = [];
    private utils: Utilities = Utilities;
    private filters: ConditionDto[] = [];

    constructor(
        private mapDashBoardService: MapDashboardService,
        private layerService: LayerService,
        private popupService: PopupService,
    ) {
        super();
    }

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
        this.setFilters(this.filters);
    }

    protected onNodeUnselect(event: any): void {
        this.markerClusterGroup.removeLayer(this.layerGroups[event.node.data]);
    }

    /**
     * Apply selected conditions in the map.
     * @event
     */
    protected setFilters(event: ConditionDto[]): void {
        this.filters = event;
        // The markerClusterGroup is always filled in.
        this.markerClusterGroup.addLayers(this.removedLayers);
        this.removedLayers = [];
        if (!this.layersBeforeFilter) {
            this.layersBeforeFilter = this.markerClusterGroup.getLayers();
        }

        // Remove layers
        const layersToRemove: L.Layer[] = [];
        this.markerClusterGroup.getLayers().forEach((layer) => {
            this.filters.forEach(filter => {
                if (filter.selected && layer[this.controlName][filter.attribute]) {
                    if (this.applyFilter(layer, filter, this.controlName)) {
                        layersToRemove.push(layer);
                        this.removedLayers.push(layer);
                    }
                }
            });
        });
        this.markerClusterGroup.removeLayers(layersToRemove);
    }

    /**
     * This method transforms the filter and checks whether it should be applied.
     * @layer
     * @filter
     */
    private applyFilter(layer: L.Layer, filter: ConditionDto, controlName: string): boolean {
        let shouldBeRemoved: boolean = false;
        // Check if the value is a number.
        if (+filter.value) {
            shouldBeRemoved = !this.utils.mathItUp[filter.condition](+layer[controlName][filter.attribute], +filter.value);
        } else {
            shouldBeRemoved = !layer[controlName][filter.attribute].includes(filter.value);
        }
        return shouldBeRemoved;
    }

    private loadMap(): void {

        this.map = L.map('map', {
            center: [40.416775, -3.703790],
            zoom: 4,
            minZoom: 3,
            maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
            maxBoundsViscosity: 0.5,
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
        this.mapDashBoardService.getAllEntities().pipe(takeUntil(this.destroy$)).subscribe((res: ModelDto[]) => {

            res.forEach(model => {
                const parentKey: string = this.layerService.getParentKey(model.type);
                this.layerGroups[model.type] = L.layerGroup();
                this.layerGroups[parentKey] = this.layerGroups[parentKey] || L.layerGroup();
                model.data.forEach(entity => this.addEntity(model, entity));
                this.layerGroups[parentKey].addLayer(this.layerGroups[model.type]);
            });

            this.loadMarkerCluster();
        });
    }

    private addEntity(model: ModelDto, entity: Entity): void {
        const marker: L.Marker = L.marker(
            entity.location.coordinates.reverse() as L.LatLngExpression,
            { icon: LeafletIcons.icons[model.type] },
        );
        marker.bindPopup(this.popupService.getPopup(model.type, entity));
        marker[this.controlName] = entity;
        this.layerGroups[model.type].addLayer(marker);
    }

    private loadMarkerCluster(): void {
        Object.values(this.layerGroups).forEach(lg => {
            this.markerClusterGroup.addLayer(lg);
        });

        this.map.addLayer(this.markerClusterGroup);
    }

}
