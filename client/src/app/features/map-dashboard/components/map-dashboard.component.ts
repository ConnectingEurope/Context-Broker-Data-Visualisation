import { CategoryFilter } from '../models/category-filter';
import { ConditionFilter } from '../models/condition-filter';
import { Component, AfterViewInit, ElementRef, OnDestroy, ComponentRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { IconUtils } from '../../../shared/misc/icon-utils';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapDashboardService } from '../services/map-dashboard.service';
import { PopupService } from '../services/popup-service';
import { Entity } from 'src/app/shared/models/entity';
import { ModelDto } from 'src/app/shared/models/model-dto';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { Utils } from '../../../shared/misc/utils';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { EntityFilter } from '../models/category-filter';
import { PopupComponent } from 'src/app/shared/templates/popup/popup.component';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { ClipboardService } from 'ngx-clipboard';
import { LayerTreeNodeService } from '../services/layer-tree-node.service';
import { CategoryService } from '../services/category-service';
import { TreeNodeService } from 'src/app/shared/services/tree-node.service';

@Component({
    selector: 'app-map-dashboard',
    templateUrl: './map-dashboard.component.html',
    styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent extends BaseComponent implements AfterViewInit, OnDestroy {

    public categories: CategoryFilter[];
    public entities: EntityFilter[] = [];
    public entityAttr: string = 'data';
    public popupAttr: string = 'popupRef';
    public tooltipAttr: string = 'tooltipComp';
    public menuItems: MenuItem[];
    public layers: TreeNode[];
    public selectedLayers: TreeNode[];
    public showButtons: boolean = false;
    public favChecked: boolean = true;
    public favAttrs: { entity: string, favAttr: string }[] = [];
    public displayDebug: boolean;
    public displayDebugHeader: string;
    public displayDebugContent: any;

    private intervalRefreshMilliseconds: number = 60000;
    private map: L.Map;
    private markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup({ animate: true, showCoverageOnHover: false });
    private layerGroups: { [key: string]: L.LayerGroup } = {};
    private layersBeforeFilter: L.Layer[];
    private removedLayers: L.Layer[] = [];
    private filters: ConditionFilter[] = [];
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
        private categoryService: CategoryService,
        private layerTreeNodeService: LayerTreeNodeService,
        private treeNodeService: TreeNodeService,
        private popupService: PopupService,
        private appMessageService: AppMessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private elem: ElementRef,
        private clipboardService: ClipboardService,
    ) {
        super();
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

    /*****************************************************************************
     Event functions
    *****************************************************************************/

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

    public onEventFilters(event: ConditionFilter[]): void {
        this.setFilters(event);
    }

    public onFavChange(event: any): void {
        this.markerClusterGroup.getLayers().forEach(l => {
            event.checked && l.getTooltip() ? this.openTooltip(l as L.Marker) : l.closeTooltip();
        });
    }

    public onLayerConditionClick(event: any): void {
        if (this.layerPanel.overlayVisible) { this.layerPanel.hide(); }
        event.stopPropagation();
        this.layerConditionsPanel.toggle(event);
    }

    public onLayerClick(event: any): void {
        if (this.layerConditionsPanel.overlayVisible) { this.layerConditionsPanel.hide(); }
        event.stopPropagation();
        this.layerPanel.toggle(event);
    }

    public onClickCopy(): void {
        this.clipboardService.copyFromContent(this.displayDebugContent);
    }

    /*****************************************************************************
     Map loading functions
    *****************************************************************************/

    private loadMap(): void {
        this.map = L.map('map', {
            center: [50.85045, 4.34878],
            zoom: this.defaultZoom,
            minZoom: 3,
            maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
            maxBoundsViscosity: 0.5,
            doubleClickZoom: false,
        });

        this.setTileLayer();
        this.map.addLayer(this.markerClusterGroup);
        this.setZoomStartEvent();
        this.setAnimationEndEvent();
    }

    private setTileLayer(): void {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);
    }

    private setZoomStartEvent(): void {
        this.map.on('zoomstart', (event) => {
            this.markerClusterGroup.getLayers().forEach(l => {
                if (l.getTooltip()) {
                    const elements: NodeList = this.elem.nativeElement.querySelectorAll('.leaflet-tooltip-pane');
                    elements.forEach((e: HTMLElement) => e.style.display = 'none');
                }
            });
        });
    }

    private setAnimationEndEvent(): void {
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

    private adjustView(): void {
        this.firstLoad = false;
        this.map.setView([
            (this.minLat + this.maxLat) / 2,
            (this.minLon + this.maxLon) / 2,
        ], this.defaultZoom);
    }

    private loadMarkerCluster(): void {
        Object.values(this.layerGroups).forEach(lg => {
            this.markerClusterGroup.addLayer(lg);
        });
    }

    /*****************************************************************************
     Filter functions
    *****************************************************************************/

    private setFilters(event: ConditionFilter[]): void {
        this.filters = event;
        this.markerClusterGroup.addLayers(this.removedLayers);
        this.removedLayers = [];
        if (!this.layersBeforeFilter) {
            this.layersBeforeFilter = this.markerClusterGroup.getLayers();
        }
        this.removeLayersForFilters();
    }

    private removeLayersForFilters(): void {
        const layersToRemove: L.Layer[] = [];
        this.markerClusterGroup.getLayers().forEach((layer) => {
            this.filters.forEach(filter => {
                if (filter.selected && layer[this.entityAttr][filter.attribute] && layer[this.entityAttr].type === filter.entity) {
                    if (this.applyFilter(layer, filter, this.entityAttr)) {
                        layersToRemove.push(layer);
                        this.removedLayers.push(layer);
                    }
                }
            });
        });
        this.markerClusterGroup.removeLayers(layersToRemove);
    }

    private applyFilter(layer: L.Layer, filter: ConditionFilter, controlName: string): boolean {
        let shouldBeRemoved: boolean = false;

        if (filter.condition !== 'contains') {
            shouldBeRemoved = !Utils.mathItUp[filter.condition](Number(layer[controlName][filter.attribute]), Number(filter.value));
        } else {
            shouldBeRemoved = !layer[controlName][filter.attribute].toString().includes(filter.value);
        }

        return shouldBeRemoved;
    }

    private loadAllEntitiesForLayers(): void {
        this.mapDashBoardService.getAllEntitiesForLayers().pipe(takeUntil(this.destroy$)).subscribe(
            (res: EntityFilter[]) => {
                this.entities = this.mapCategories(res);
                this.loadLayerMenu();
            },
            err => {
                this.onLoadEntitiesFail();
            });
    }

    private mapCategories(entities: EntityFilter[]): EntityFilter[] {
        this.categories = [];

        entities.forEach((entity) => {
            const categoryKey: string = this.categoryService.getCategoryKey(entity.name);
            const categoryExist: CategoryFilter = this.categories.find((category) => category.name === categoryKey);
            entity.label = entity.name;
            !categoryExist ? this.addCategory(categoryKey, entity) : categoryExist.entities.push(entity);
        });

        return entities;
    }

    private addCategory(categoryKey: string, entity: EntityFilter): void {
        this.categories.push({
            name: categoryKey,
            label: IconUtils.categoryName[categoryKey],
            icon: IconUtils.icons[categoryKey],
            entities: [entity],
        });
    }

    /*****************************************************************************
     Layers functions
    *****************************************************************************/

    private loadLayerMenu(): void {
        this.layers = this.layerTreeNodeService.getMainLayers(this.categories);
        this.selectedLayers = this.treeNodeService.getAllSelected(this.layers);
    }

    /*****************************************************************************
     Data loading functions
    *****************************************************************************/

    private visualizeEntities(): void {
        this.loadEntities();
        this.interval = setInterval(() => {
            if (!this.firstLoad) {
                this.loadedIdsCopy = JSON.parse(JSON.stringify(this.loadedIds));
                this.loadEntities();
            }
        }, this.intervalRefreshMilliseconds);
    }

    private loadEntities(): void {
        this.mapDashBoardService.getEntitiesData(!this.firstLoad).pipe(takeUntil(this.destroy$)).subscribe(
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
                this.onLoadEntitiesFail();
            });
    }

    private onLoadEntitiesSuccess(models: ModelDto[]): void {
        this.refreshing = true;

        this.storeFavAttrs(models);
        this.processModels(models);
        if (this.firstLoad) { this.adjustView(); }
        this.deleteOldEntities();
        this.loadMarkerCluster();
        this.setFilters(this.filters);
        this.unselectedLayers.forEach(l => this.markerClusterGroup.removeLayer(this.layerGroups[l]));
        if (this.openPopup) { this.openPopup.openPopup(); }

        this.refreshing = false;
    }

    private processModels(models: ModelDto[]): void {
        models.forEach(model => {
            const categoryKey: string = this.categoryService.getCategoryKey(model.type);
            this.layerGroups[model.type] = this.layerGroups[model.type] || L.layerGroup();
            this.layerGroups[categoryKey] = this.layerGroups[categoryKey] || L.layerGroup();
            model.data.forEach(entity => this.addEntity(model, entity, categoryKey));
            this.layerGroups[categoryKey].addLayer(this.layerGroups[model.type]);
        });
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
        this.appMessageService.add({ severity: 'error', summary: 'Cannot load the configuration' });
    }

    /*****************************************************************************
     Entity functions
    *****************************************************************************/

    private addEntity(model: ModelDto, entity: Entity, categoryKey: string): void {
        if (entity.location && entity.location.coordinates && entity.location.coordinates[0] && entity.location.coordinates[1]) {
            this.storeMinMaxLocation(entity.location.coordinates[1], entity.location.coordinates[0]);
            const markers: L.Layer[] = this.layerGroups[model.type].getLayers();
            const existentMarker: L.Marker = markers.find(m => m[this.entityAttr].id === entity.id) as L.Marker;
            existentMarker ? this.updateEntity(existentMarker, model, entity) : this.insertEntity(model, entity, categoryKey);
        }
    }

    private insertEntity(model: ModelDto, entity: Entity, categoryKey: string): void {
        const marker: L.Marker = L.marker(
            entity.location.coordinates.reverse() as L.LatLngExpression,
            { icon: IconUtils.leafletIcons[categoryKey] },
        );

        this.setTooltip(marker, entity, model);
        this.setPopup(marker, entity, model);
        marker[this.entityAttr] = entity;

        this.layerGroups[model.type].addLayer(marker);

        if (!this.loadedIds[model.type]) { this.loadedIds[model.type] = []; }
        this.loadedIds[model.type].push(entity.id);
    }

    private updateEntity(existentMarker: L.Marker, model: ModelDto, entity: Entity): void {
        if (this.hasLocationBeenUpdated(existentMarker, entity)) {
            existentMarker.setLatLng(entity.location.coordinates.reverse() as L.LatLngExpression);
        }
        this.setTooltip(existentMarker, entity, model);
        this.setPopup(existentMarker, entity, model);
        existentMarker[this.entityAttr] = entity;

        const i: number = this.loadedIdsCopy[model.type].indexOf(entity.id);
        if (i !== -1) { this.loadedIdsCopy[model.type].splice(i, 1); }
    }

    private deleteOldEntities(): void {
        Object.keys(this.loadedIdsCopy).forEach(entityType => {
            const ids: string[] = this.loadedIdsCopy[entityType];
            ids.forEach(id => {
                const i: number = this.loadedIds[entityType].indexOf(id);
                if (i !== -1) { this.loadedIds[entityType].splice(i, 1); }
                const markers: L.Layer[] = this.layerGroups[entityType].getLayers();
                const oldSensor: L.Marker = markers.find(m => m[this.entityAttr].id === id) as L.Marker;
                oldSensor.remove();
            });
        });
    }

    private storeMinMaxLocation(lat: number, lon: number): void {
        this.minLat = this.minLat > lat ? lat : this.minLat;
        this.minLon = this.minLon > lon ? lon : this.minLon;
        this.maxLat = this.maxLat < lat ? lat : this.maxLat;
        this.maxLon = this.maxLon < lon ? lon : this.maxLon;
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

    /*****************************************************************************
     Marker event functions
    *****************************************************************************/

    private setMarkerEvents(marker: L.Marker, popup: L.Popup, popupComponentRef: ComponentRef<PopupComponent>): void {
        marker.on('click', event => {
            marker.closeTooltip();
        });

        marker.on('popupopen', () => {
            this.openPopup = popup;
            popupComponentRef.instance.refreshScroll();
        });

        marker.on('popupclose', () => {
            if (!this.refreshing) { this.openPopup = undefined; }
            this.openTooltip(marker);
        });
    }

    /*****************************************************************************
     Popup functions
    *****************************************************************************/

    private setPopup(marker: L.Marker, entity: Entity, model: ModelDto): void {
        let popup: L.Popup = marker.getPopup();
        let popupComponentRef: ComponentRef<PopupComponent>;

        if (!popup) {
            popup = L.popup();
            popupComponentRef = this.popupService.createPopupComponent(entity, model);
            popupComponentRef.instance.clickDebug.pipe(takeUntil(this.destroy$)).subscribe(() => this.onClickDebug(model, entity, marker));
            popup.setContent(popupComponentRef.location.nativeElement);
            marker.bindPopup(popup);
            marker[this.popupAttr] = popupComponentRef;
            this.setMarkerEvents(marker, popup, popupComponentRef);
        } else {
            popupComponentRef = marker[this.popupAttr];
            popupComponentRef.instance.updatePopup(entity, model);
            popupComponentRef.changeDetectorRef.detectChanges();
        }
    }

    /*****************************************************************************
     Tooltip functions
    *****************************************************************************/

    private setTooltip(marker: L.Marker, entity: Entity, model: ModelDto): void {
        const tooltipContent: string = this.getTooltipContent(entity, model);

        if (tooltipContent) {
            if (!marker.getTooltip()) {
                marker.bindTooltip(tooltipContent, {
                    offset: new L.Point(0, 5),
                    direction: 'top',
                    permanent: true,
                    opacity: 0.9,
                });
            } else {
                marker.setTooltipContent(tooltipContent);
            }
        }

        marker[this.tooltipAttr] = marker.getTooltip();
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

    private getTooltipContent(entity: Entity, model: ModelDto): string {
        return model.favAttr && entity[model.favAttr] ? ('<span>' + entity[model.favAttr] + '</span>') : undefined;
    }

    /*****************************************************************************
     Main/favourite attributes functions
    *****************************************************************************/

    private storeFavAttrs(models: ModelDto[]): void {
        this.favAttrs = models.filter(m => m.favAttr).map(m => ({ entity: m.type, favAttr: m.favAttr }));
    }

    /*****************************************************************************
     Debug entity functions
    *****************************************************************************/

    private onClickDebug(model: ModelDto, entity: Entity, marker: L.Marker): void {
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

}
