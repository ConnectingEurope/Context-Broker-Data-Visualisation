import { CategoryDto } from './../models/model-dto';
import { EntityDto } from 'src/app/features/config-dashboard/models/entity-dto';
import { ConditionDto } from './../models/condition-dto';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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
import { Entity } from 'src/app/shared/models/entity';
import { ModelDto } from 'src/app/shared/models/model-dto';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { Utilities } from '../../../shared/utils/utilities';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { CategoryEntityDto } from '../models/model-dto';

@Component({
    selector: 'app-map-dashboard',
    templateUrl: './map-dashboard.component.html',
    styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

    protected categories: CategoryDto[];
    protected entities: CategoryEntityDto[] = [];
    protected controlName: string = 'data';
    protected menuItems: MenuItem[];
    protected layers: TreeNode[];
    protected selectedLayers: TreeNode[];

    private map: L.Map;
    private markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup();
    private layerGroups: { [key: string]: L.LayerGroup } = {};
    private layersBeforeFilter: L.Layer[];
    private removedLayers: L.Layer[] = [];
    private filters: ConditionDto[] = [];

    constructor(
        private mapDashBoardService: MapDashboardService,
        private layerService: LayerService,
        private popupService: PopupService,
        private elem: ElementRef,
        private appMessageService: AppMessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) {
        super();
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit(): void {
        this.loadAllEntitiesForLayers();
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
            shouldBeRemoved = !Utilities.mathItUp[filter.condition](+layer[controlName][filter.attribute], +filter.value);
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
        this.addFocusOutEventToGeoSearch();
    }

    private addFocusOutEventToGeoSearch(): void {
        const geosearchContainer: any = this.elem.nativeElement.querySelectorAll('.geosearch')[0];
        const geosearchInput: any = this.elem.nativeElement.querySelectorAll('.glass')[0];
        geosearchInput.addEventListener('focusout', (e) => { geosearchContainer.classList.remove('active'); }, false);
    }

    private loadLayerMenu(): void {
        this.layers = this.layerService.getMainLayers(this.categories);
        this.selectedLayers = this.layerService.getAllSelected(this.layers);
    }

    private loadEntities(): void {
        this.mapDashBoardService.getAllEntities().pipe(takeUntil(this.destroy$)).subscribe(
            (models: ModelDto[]) => {
                if (models.length > 0) {
                    this.onLoadEntitiesSuccess(models);
                } else {
                    this.onLoadEntitiesEmpty();
                }
            },
            err => {
                this.onLoadEntitiesFail();
            });
    }

    private loadAllEntitiesForLayers(): void {
        this.mapDashBoardService.getAllEntitiesForLayers().pipe(takeUntil(this.destroy$)).subscribe(
            (res: CategoryEntityDto[]) => {
                this.entities = this.mapCategories(res);
                this.loadLayerMenu();
            },
            err => {
                this.onLoadEntitiesFail();
            });
    }

    private mapCategories(entities: CategoryEntityDto[]): CategoryEntityDto[] {
        this.categories = [];
        entities.forEach((entity) => {
            const parentKey: string = this.layerService.getParentKey(entity.name);
            const categoryExist: CategoryDto = this.categories.find((category) => {
                return category.name === parentKey;
            });
            if (!categoryExist) {
                this.categories.push({ name: parentKey, icon: LeafletIcons.icons[parentKey], entities: [entity] });
            } else {
                categoryExist.entities.push(entity);
            }
        });
        return entities;
    }

    private onLoadEntitiesSuccess(models: ModelDto[]): void {
        models.forEach(model => {
            const parentKey: string = this.layerService.getParentKey(model.type);
            this.layerGroups[model.type] = L.layerGroup();
            this.layerGroups[parentKey] = this.layerGroups[parentKey] || L.layerGroup();
            model.data.forEach(entity => this.addEntity(model, entity, parentKey));
            this.layerGroups[parentKey].addLayer(this.layerGroups[model.type]);
        });

        this.loadMarkerCluster();
    }

    private onLoadEntitiesEmpty(): void {
        this.confirmationService.confirm({
            icon: 'pi pi-info',
            header: 'There is no configuration yet',
            message: 'Do you want to configure the dashboard?',
            acceptLabel: 'Configure',
            rejectLabel: 'Cancel',
            accept: (): void => {
                this.router.navigate(['/config-dashboard']);
            },
        });
    }

    private onLoadEntitiesFail(): void {
        this.appMessageService.add({ severity: 'error', summary: 'Something went wrong trying to load the configuration' });
    }

    private addEntity(model: ModelDto, entity: Entity, parentKey: string): void {
        if (entity.location && entity.location.coordinates) {
            const marker: L.Marker = L.marker(
                entity.location.coordinates.reverse() as L.LatLngExpression,
                { icon: LeafletIcons.icons[parentKey] },
            );
            marker.bindPopup(this.popupService.getPopup(model.type, entity));
            marker[this.controlName] = entity;
            this.layerGroups[model.type].addLayer(marker);
        }
    }

    private loadMarkerCluster(): void {
        Object.values(this.layerGroups).forEach(lg => {
            this.markerClusterGroup.addLayer(lg);
        });

        this.map.addLayer(this.markerClusterGroup);
    }
}
