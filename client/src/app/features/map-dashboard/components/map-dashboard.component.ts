import { FwiUtils } from '../../../shared/misc/fwi-utils';
import { CategoryDto } from './../models/model-dto';
import { ConditionDto } from './../models/condition-dto';
import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, ComponentRef, ViewChild } from '@angular/core';
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
import { PopupComponent } from 'src/app/shared/templates/popup/popup.component';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-map-dashboard',
    templateUrl: './map-dashboard.component.html',
    styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    public categories: CategoryDto[];
    public entities: CategoryEntityDto[] = [];
    public controlName: string = 'data';
    public popupName: string = 'popupRef';
    public tooltipName: string = 'tooltipComp';
    public menuItems: MenuItem[];
    public layers: TreeNode[];
    public selectedLayers: TreeNode[];
    public showButtons: boolean = false;
    public favChecked: boolean = true;
    public favAttrs: { entity: string, favAttr: string }[] = [];
    public displayDebug: boolean;
    public displayDebugHeader: string;
    public displayDebugContent: any;

    private map: L.Map;
    private markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup({ animate: true, showCoverageOnHover: false });
    private layerGroups: { [key: string]: L.LayerGroup } = {};
    private layersBeforeFilter: L.Layer[];
    private removedLayers: L.Layer[] = [];
    private filters: ConditionDto[] = [];
    private unselectedLayers: any[] = [];
    private loadedIds: { [key: string]: string[] } = {};
    private loadedIdsCopy: { [key: string]: string[] } = {};
    private openPopup: L.Popup;
    private refreshing: boolean;
    private firstFetch: boolean = true;
    private interval: any;
    private minLat: number = Number.MAX_VALUE;
    private minLon: number = Number.MAX_VALUE;
    private maxLat: number = Number.MIN_VALUE;
    private maxLon: number = Number.MIN_VALUE;
    private defaultZoom: number = 4;
    private firstLoad: boolean = true;

    @ViewChild('layerConditionsPanel') private layerConditionsPanel: OverlayPanel;
    @ViewChild('layerPanel') private layerPanel: OverlayPanel;

    constructor(
        private mapDashBoardService: MapDashboardService,
        private layerService: LayerService,
        private popupService: PopupService,
        private appMessageService: AppMessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private elem: ElementRef,
        private clipboardService: ClipboardService,
    ) {
        super();
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit(): void {
        this.loadAllEntitiesForLayers();
        this.loadMap();
        this.loadSearchBar();
        this.visualizeEntities();
    }

    public ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    public onNodeSelect(event: any): void {
        const i: number = this.unselectedLayers.indexOf(event.node.data);
        this.unselectedLayers.splice(i, 1);
        this.markerClusterGroup.addLayer(this.layerGroups[event.node.data]);
        this.setFilters(this.filters);
    }

    public onNodeUnselect(event: any): void {
        this.unselectedLayers.push(event.node.data);
        this.markerClusterGroup.removeLayer(this.layerGroups[event.node.data]);
    }

    /**
     * Apply selected conditions in the map.
     * @event
     */
    public setFilters(event: ConditionDto[]): void {
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
                if (filter.selected && layer[this.controlName][filter.attribute]
                    && layer[this.controlName].type === filter.entity) {
                    if (this.applyFilter(layer, filter, this.controlName)) {
                        layersToRemove.push(layer);
                        this.removedLayers.push(layer);
                    }
                }
            });
        });
        this.markerClusterGroup.removeLayers(layersToRemove);
    }

    public onFavChange(event: any): void {
        this.markerClusterGroup.getLayers().forEach(l => {
            event.checked && l.getTooltip() ? this.openTooltip(l as L.Marker) : l.closeTooltip();
        });
    }

    public onLayerConditionClick(event: any): void {
        event.stopPropagation();
        this.layerConditionsPanel.toggle(event);
    }

    public onLayerClick(event: any): void {
        event.stopPropagation();
        this.layerPanel.toggle(event);
    }

    public onClickCopy(): void {
        this.clipboardService.copyFromContent(this.displayDebugContent);
    }

    /**
     * This method transforms the filter and checks whether it should be applied.
     * @layer
     * @filter
     */
    private applyFilter(layer: L.Layer, filter: ConditionDto, controlName: string): boolean {
        let shouldBeRemoved: boolean = false;
        // Check if the value is a number.
        if (filter.condition !== 'contains') {
            shouldBeRemoved = !Utilities.mathItUp[filter.condition](+layer[controlName][filter.attribute], +filter.value);
        } else {
            shouldBeRemoved = !layer[controlName][filter.attribute].toString().includes(filter.value);
        }
        return shouldBeRemoved;
    }

    private loadMap(): void {

        this.map = L.map('map', {
            center: [50.85045, 4.34878],
            zoom: this.defaultZoom,
            minZoom: 3,
            maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
            maxBoundsViscosity: 0.5,
            doubleClickZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.map.addLayer(this.markerClusterGroup);

        this.map.on('zoomstart', (event) => {
            this.markerClusterGroup.getLayers().forEach(l => {
                if (l.getTooltip()) {
                    const elements: NodeList = this.elem.nativeElement.querySelectorAll('.leaflet-tooltip-pane');
                    elements.forEach((e: HTMLElement) => e.style.display = 'none');
                }
            });
        });

        this.markerClusterGroup.on('animationend', () => {
            this.markerClusterGroup.getLayers().forEach(l => {
                this.openTooltip(l as L.Marker);
            });
        });

    }

    private loadSearchBar(): void {
        const searchControl: GeoSearchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            autoClose: true,
        });

        this.map.addControl(searchControl);
    }

    private loadLayerMenu(): void {
        this.layers = this.layerService.getMainLayers(this.categories);
        this.selectedLayers = this.layerService.getAllSelected(this.layers);
    }

    private loadEntities(): void {
        this.mapDashBoardService.getAllEntities(!this.firstLoad).pipe(takeUntil(this.destroy$)).subscribe(
            (models: ModelDto[]) => {
                if (models.length > 0) {
                    this.showButtons = true;
                    this.onLoadEntitiesSuccess(models);
                } else {
                    this.showButtons = false;
                    this.onLoadEntitiesEmpty();
                }
            },
            err => {
                console.log(err);
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
                console.log(err);
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

            entity.label = FwiUtils.entityName[entity.name] || entity.name;

            if (!categoryExist) {
                this.categories.push({
                    name: parentKey, label: FwiUtils.categoryName[parentKey],
                    icon: FwiUtils.icons[parentKey], entities: [entity],
                });
            } else {
                categoryExist.entities.push(entity);
            }
        });
        return entities;
    }

    private onLoadEntitiesSuccess(models: ModelDto[]): void {
        this.refreshing = true;
        this.storeFavAttrs(models);
        models.forEach(model => {
            const parentKey: string = this.layerService.getParentKey(model.type);
            this.layerGroups[model.type] = this.layerGroups[model.type] || L.layerGroup();
            this.layerGroups[parentKey] = this.layerGroups[parentKey] || L.layerGroup();
            model.data.forEach(entity => this.addEntity(model, entity, parentKey));
            this.layerGroups[parentKey].addLayer(this.layerGroups[model.type]);
        });
        if (this.firstLoad) { this.adjustView(); }
        this.deleteOldSensors();
        this.loadMarkerCluster();
        this.setFilters(this.filters);
        this.unselectedLayers.forEach(l => {
            this.markerClusterGroup.removeLayer(this.layerGroups[l]);
        });
        if (this.openPopup) {
            this.openPopup.openPopup();
        }
        this.refreshing = false;
    }

    private storeFavAttrs(models: ModelDto[]): void {
        this.favAttrs = models.filter(m => m.favAttr).map(m => ({ entity: m.type, favAttr: m.favAttr }));
    }

    private adjustView(): void {
        this.firstLoad = false;
        this.map.setView([
            (this.minLat + this.maxLat) / 2,
            (this.minLon + this.maxLon) / 2,
        ], this.defaultZoom);
    }

    private visualizeEntities(): void {
        this.loadEntities();
        this.interval = setInterval(() => {
            if (!this.firstLoad) {
                this.loadedIdsCopy = JSON.parse(JSON.stringify(this.loadedIds));
                this.loadEntities();
            }
        }, 60000);
    }

    private onLoadEntitiesEmpty(): void {
        if (this.firstFetch) {
            this.firstFetch = false;
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
    }

    private onLoadEntitiesFail(): void {
        this.appMessageService.add({ severity: 'error', summary: 'Something went wrong trying to load the configuration' });
    }

    private addEntity(model: ModelDto, entity: Entity, parentKey: string): void {
        if (entity.location && entity.location.coordinates && entity.location.coordinates[0] && entity.location.coordinates[1]) {
            this.storeMinMaxLocation(entity.location.coordinates[1], entity.location.coordinates[0]);
            const markers: any = this.layerGroups[model.type].getLayers();
            const existentMarker: L.Marker = markers.find(m => m[this.controlName].id === entity.id);
            if (existentMarker) {
                this.updateEntity(existentMarker, model, entity);
            } else {
                this.insertEntity(model, entity, parentKey);
            }
        }
    }

    private storeMinMaxLocation(lat: number, lon: number): void {
        this.minLat = this.minLat > lat ? lat : this.minLat;
        this.minLon = this.minLon > lon ? lon : this.minLon;
        this.maxLat = this.maxLat < lat ? lat : this.maxLat;
        this.maxLon = this.maxLon < lon ? lon : this.maxLon;
    }

    private insertEntity(model: ModelDto, entity: any, parentKey: string): void {
        const marker: L.Marker = L.marker(
            entity.location.coordinates.reverse() as L.LatLngExpression,
            { icon: LeafletIcons.icons[parentKey] },
        );

        this.setTooltip(marker, entity, model);

        const popup: L.Popup = L.popup();
        const popupComponentRef: ComponentRef<PopupComponent> = this.popupService.getPopupContent(entity, model);
        const div: HTMLDivElement = document.createElement('div');
        div.appendChild(popupComponentRef.location.nativeElement);
        popup.setContent(div);
        marker.bindPopup(popup);

        popupComponentRef.instance.clickDebug.pipe(takeUntil(this.destroy$)).subscribe(() => this.onClickDebug(model, entity, marker));

        marker.on('popupopen', () => {
            this.openPopup = popup;
            popupComponentRef.instance.refreshScroll();
        });
        marker.on('popupclose', () => {
            if (!this.refreshing) { this.openPopup = undefined; }
        });

        marker[this.controlName] = entity;
        marker[this.popupName] = popupComponentRef;
        marker[this.tooltipName] = marker.getTooltip();
        this.layerGroups[model.type].addLayer(marker);

        if (!this.loadedIds[model.type]) { this.loadedIds[model.type] = []; }
        this.loadedIds[model.type].push(entity.id);
    }

    private deleteOldSensors(): void {
        Object.keys(this.loadedIdsCopy).forEach(entityType => {
            const ids: string[] = this.loadedIdsCopy[entityType];
            ids.forEach(id => {
                const i: number = this.loadedIds[entityType].indexOf(id);
                if (i !== -1) { this.loadedIds[entityType].splice(i, 1); }

                const markers: any = this.layerGroups[entityType].getLayers();
                const oldSensor: L.Marker = markers.find(m => m[this.controlName].id === id);
                oldSensor.remove();
            });
        });
    }

    private updateEntity(existentMarker: L.Marker, model: ModelDto, entity: Entity): void {
        if (this.hasLocationBeenUpdated(existentMarker, entity)) {
            existentMarker.setLatLng(entity.location.coordinates.reverse() as L.LatLngExpression);
        }
        existentMarker[this.popupName].instance.updatePopup(entity, model);
        existentMarker[this.popupName].changeDetectorRef.detectChanges();
        existentMarker[this.controlName] = entity;
        existentMarker[this.tooltipName] = existentMarker.getTooltip();
        this.setTooltip(existentMarker, entity, model);

        const i: number = this.loadedIdsCopy[model.type].indexOf(entity.id);
        if (i !== -1) { this.loadedIdsCopy[model.type].splice(i, 1); }
    }

    private onClickDebug(model: ModelDto, entity: any, marker: L.Marker): void {
        this.mapDashBoardService.getEntity(model, entity).subscribe(
            data => {
                if (data.length > 0) {
                    this.onClickDebugSuccess(data[0], marker);
                } else {
                    this.onClickDebugFail();
                }
            },
            err => {
                this.onClickDebugFail();
            },
        );
    }

    private onClickDebugSuccess(data: any, marker: L.Marker): void {
        marker.closePopup();
        this.displayDebugHeader = data.id;
        this.displayDebugContent = data;
        this.displayDebug = true;
    }

    private onClickDebugFail(): void {
        this.appMessageService.add({ severity: 'error', summary: 'Cannot load the data' });
    }

    private setTooltip(marker: L.Marker, entity: any, model: ModelDto): void {
        const tooltipContent: string = this.getTooltipContent(entity, model);
        if (tooltipContent) {
            if (!marker.getTooltip()) {
                marker.bindTooltip(tooltipContent, {
                    offset: new L.Point(0, 5),
                    direction: 'top',
                    permanent: true,
                    opacity: 0.9,
                });

                marker.on('popupclose', event => {
                    this.openTooltip(marker);
                });

                marker.on('click', event => {
                    marker.closeTooltip();
                });

            } else {
                marker.setTooltipContent(tooltipContent);
            }
        }
    }

    private openTooltip(marker: L.Marker): void {
        if (this.favChecked) {
            if (marker.getTooltip()) {
                const elements: NodeList = this.elem.nativeElement.querySelectorAll('.leaflet-tooltip-pane');
                elements.forEach((e: HTMLElement) => e.style.display = 'block');
                marker.openTooltip();
            }
        }
    }

    private getTooltipContent(entity: any, model: ModelDto): string {
        return model.favAttr && entity[model.favAttr] ? ('<span>' + entity[model.favAttr] + '</span>') : undefined;
    }

    private hasLocationBeenUpdated(existentMarker: L.Marker, entity: Entity): boolean {
        const currentLatLng: L.LatLng = existentMarker.getLatLng();
        const currentLat: number = currentLatLng.lat;
        const currentLng: number = currentLatLng.lng;

        const newLatLng: number[] = entity.location.coordinates.reverse();
        const newLat: number = newLatLng[0];
        const newLng: number = newLatLng[1];

        return currentLat !== newLat || currentLng !== newLng;
    }

    private loadMarkerCluster(): void {
        Object.values(this.layerGroups).forEach(lg => {
            this.markerClusterGroup.addLayer(lg);
        });

        // this.map.addLayer(this.markerClusterGroup);
    }
}
