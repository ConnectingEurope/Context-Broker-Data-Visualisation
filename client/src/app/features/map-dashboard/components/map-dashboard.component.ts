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
import { takeUntil, filter } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { Utils } from '../../../shared/misc/utils';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { EntityFilter } from '../models/category-filter';
import { PopupComponent } from 'src/app/shared/templates/popup/popup.component';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { LayerTreeNodeService } from '../services/layer-tree-node.service';
import { CategoryService } from '../services/category-service';
import { TreeNodeService } from 'src/app/shared/services/tree-node.service';
import { EntityMetadata } from 'src/app/shared/models/entity-metadata';
import { Observable, combineLatest } from 'rxjs';

@Component({
    selector: 'app-map-dashboard',
    templateUrl: './map-dashboard.component.html',
    styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent extends BaseComponent implements AfterViewInit, OnDestroy {

    public categories: CategoryFilter[];
    public entities: EntityFilter[] = [];
    public menuItems: MenuItem[];
    public layers: TreeNode[];
    public selectedLayers: TreeNode[];
    public showButtons: boolean = false;
    public favChecked: boolean = true;
    public favAttrs: { entity: string, favAttr: string }[] = [];
    public displayDebug: boolean;
    public displayDebugHeader: string;
    public displayDebugContent: Entity;

    private intervalRefreshMilliseconds: number = 20000;
    private entityAttr: string = 'data';
    // private popupCompAttr: string = 'popupRef';
    // private tooltipAttr: string = 'tooltipComp';
    private map: L.Map;
    private markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup({ animate: true, showCoverageOnHover: false });
    private layerGroups: { [key: string]: L.LayerGroup } = {};
    private layersBeforeFilter: L.Layer[];
    private removedLayers: L.Layer[] = [];
    private filters: ConditionFilter[] = [];
    private unselectedLayers: any[] = [];
    private currentModels: ModelDto[] = [];
    private markersByModelAndId: any = {};
    private currentPopup: L.Popup;
    private refreshing: boolean;
    private firstFetch: boolean = true;
    private interval: any;
    private minLat: number = Number.POSITIVE_INFINITY;
    private minLon: number = Number.POSITIVE_INFINITY;
    private maxLat: number = Number.NEGATIVE_INFINITY;
    private maxLon: number = Number.NEGATIVE_INFINITY;
    private defaultZoom: number = 4;
    private firstLoad: boolean = true;
    private tooltipMaxChars: number = 25;
    private filteredAttrs: any = {};

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
        this.setFilters();
    }

    public onNodeUnselect(event: any): void {
        this.unselectedLayers.push(event.node.data);
        this.markerClusterGroup.removeLayer(this.layerGroups[event.node.data]);
    }

    public onEventFilters(event: ConditionFilter[]): void {
        this.filters = event;
        this.storeFilterAttrs(event);
        clearInterval(this.interval);
        this.startInterval();
        this.updateEntities(true);
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
        if (this.minLat !== Number.POSITIVE_INFINITY && this.minLon !== Number.POSITIVE_INFINITY &&
            this.maxLat !== Number.NEGATIVE_INFINITY && this.maxLon !== Number.NEGATIVE_INFINITY) {
            const lat: number = (this.minLat + this.maxLat) / 2;
            const lon: number = (this.minLon + this.maxLon) / 2;
            if (!isNaN(lat) && !isNaN(lon)) {
                this.map.setView([lat, lon], this.defaultZoom);
            }
        }
    }

    private loadMarkerCluster(): void {
        Object.values(this.layerGroups).forEach(lg => {
            this.markerClusterGroup.addLayer(lg);
        });
    }

    /*****************************************************************************
     Filter functions
    *****************************************************************************/

    private setFilters(): void {
        this.markerClusterGroup.addLayers(this.removedLayers);
        this.removedLayers = [];
        if (!this.layersBeforeFilter) {
            this.layersBeforeFilter = this.markerClusterGroup.getLayers();
        }
        this.removeLayersForFilters();
    }

    private storeFilterAttrs(filters: ConditionFilter[]): void {
        this.filteredAttrs = {};
        filters.forEach(f => {
            if (!this.filteredAttrs[f.entity]) { this.filteredAttrs[f.entity] = []; }
            this.filteredAttrs[f.entity].push(f.attribute);
        });
    }

    private removeLayersForFilters(): void {
        const layersToRemove: L.Layer[] = [];
        this.markerClusterGroup.getLayers().forEach((layer) => {
            this.filters.forEach(f => {
                if (f.selected && layer[this.entityAttr][f.attribute] && layer[this.entityAttr].type === f.entity) {
                    if (this.applyFilter(layer, f, this.entityAttr)) {
                        layersToRemove.push(layer);
                        this.removedLayers.push(layer);
                    }
                }
            });
        });
        this.markerClusterGroup.removeLayers(layersToRemove);
    }

    private applyFilter(layer: L.Layer, f: ConditionFilter, controlName: string): boolean {
        let shouldBeRemoved: boolean = false;

        if (f.condition !== 'contains') {
            shouldBeRemoved = !Utils.mathItUp[f.condition](Number(layer[controlName][f.attribute]), Number(f.value));
        } else {
            shouldBeRemoved = !layer[controlName][f.attribute].toString().includes(f.value);
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
                this.onLoadDataFail();
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
                this.onLoadDataFail();
            });
    }

    private onLoadEntitiesSuccess(models: ModelDto[]): void {
        this.refreshing = true;

        this.currentModels = models;
        this.storeFavAttrs(models);
        this.processModels(models);
        this.adjustView();
        this.loadMarkerCluster();
        this.setFilters();
        // this.unselectedLayers.forEach(l => this.markerClusterGroup.removeLayer(this.layerGroups[l]));
        // if (this.currentPopup) { this.currentPopup.openPopup(); }

        this.refreshing = false;
        this.startInterval();
    }

    private startInterval(): void {
        this.interval = setInterval(() => {
            this.updateEntities();
        }, this.intervalRefreshMilliseconds);
    }

    private updateEntities(triggeredByFilter?: boolean): void {
        const combinedCalls: Observable<any>[] = [];
        this.currentModels.forEach((model, i) => {
            const obs: Observable<Entity[]> = this.mapDashBoardService
                .getEntitiesForUpdating(model, this.filteredAttrs[model.type], !triggeredByFilter);
            combinedCalls.push(obs);
            obs.pipe(takeUntil(this.destroy$)).subscribe(
                (entities: Entity[]) => {
                    entities.forEach(e => {
                        const marker: L.Marker = this.markersByModelAndId[i][e.id];
                        if (marker && this.isValidCoordinates(e)) {
                            const currentLocation: number[] = e.location.coordinates;
                            if (this.hasLocationBeenUpdated(marker, currentLocation)) {
                                marker.setLatLng(currentLocation.slice().reverse() as L.LatLngExpression);
                            }
                            Object.entries(e).forEach(a => marker[this.entityAttr][a[0]] = a[1]);
                            this.setTooltip(marker, e, model);
                        }
                    });
                });
        });
        combineLatest(combinedCalls).pipe(takeUntil(this.destroy$)).subscribe(
            (combinedResults) => {
                this.setFilters();
            },
        );
    }

    private processModels(models: ModelDto[]): void {
        models.forEach((model, i) => {
            const categoryKey: string = this.categoryService.getCategoryKey(model.type);
            this.markersByModelAndId[i] = {};
            this.layerGroups[model.type] = this.layerGroups[model.type] || L.layerGroup();
            this.layerGroups[categoryKey] = this.layerGroups[categoryKey] || L.layerGroup();
            model.data.forEach(entity => this.addEntity(model, entity, categoryKey, i));
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
                    this.router.navigate(['/configuration']);
                },
            });
        }
    }

    private onLoadDataFail(): void {
        this.appMessageService.add({ severity: 'error', summary: 'Something went wrong getting data' });
    }

    /*****************************************************************************
     Entity functions
    *****************************************************************************/

    private addEntity(model: ModelDto, entity: Entity, categoryKey: string, i: number): void {
        if (this.isValidCoordinates(entity)) {
            this.storeMinMaxLocation(entity.location.coordinates[1], entity.location.coordinates[0]);
            this.insertEntity(model, entity, categoryKey, i);
        }
    }

    private isValidCoordinates(entity: Entity): boolean {
        return entity.location && entity.location.coordinates &&
            entity.location.coordinates[0] && entity.location.coordinates[1] &&
            !isNaN(entity.location.coordinates[0]) && !isNaN(entity.location.coordinates[1]);
    }

    private insertEntity(model: ModelDto, entity: Entity, categoryKey: string, i: number): void {
        const marker: L.Marker = L.marker(
            entity.location.coordinates.slice().reverse() as L.LatLngExpression,
            { icon: IconUtils.leafletIcons[categoryKey] },
        );
        this.setEntityParams(marker, entity, model, i);
    }

    private setEntityParams(marker: L.Marker, entity: Entity, model: ModelDto, i: number): void {
        this.setTooltip(marker, entity, model);
        this.setPopup(marker, entity, model);
        marker[this.entityAttr] = entity;
        this.markersByModelAndId[i][entity.id] = marker;
        this.layerGroups[model.type].addLayer(marker);
    }

    private storeMinMaxLocation(lat: number, lon: number): void {
        this.minLat = this.minLat > lat ? lat : this.minLat;
        this.minLon = this.minLon > lon ? lon : this.minLon;
        this.maxLat = this.maxLat < lat ? lat : this.maxLat;
        this.maxLon = this.maxLon < lon ? lon : this.maxLon;
    }

    private hasLocationBeenUpdated(marker: L.Marker, currentLocation: number[]): boolean {
        const currentLatLng: L.LatLng = marker.getLatLng();
        const currentLat: number = currentLatLng.lat;
        const currentLng: number = currentLatLng.lng;

        const newLatLng: number[] = currentLocation.slice().reverse();
        const newLat: number = newLatLng[0];
        const newLng: number = newLatLng[1];

        return currentLat !== newLat || currentLng !== newLng;
    }

    /*****************************************************************************
     Marker event functions
    *****************************************************************************/

    private setMarkerEvents(marker: L.Marker, p: L.Popup, pRef: ComponentRef<PopupComponent>, entity: Entity, model: ModelDto): void {

        marker.on('click', () => {
            marker.isPopupOpen() ? this.closePopup(marker) : this.openPopup(marker, p, pRef, entity, model);
        });

        marker.on('popupopen', () => {
            marker.closeTooltip();
        });

        marker.on('popupclose', () => {
            if (!this.refreshing) { this.currentPopup = undefined; }
            this.openTooltip(marker);
            marker.unbindPopup();
        });

    }

    /*****************************************************************************
     Popup functions
    *****************************************************************************/

    private setPopup(marker: L.Marker, entity: Entity, model: ModelDto): void {
        const popup: L.Popup = L.popup();
        const popupComponentRef: ComponentRef<PopupComponent> = this.popupService.createPopupComponent(entity, model);
        popupComponentRef.instance.clickDebug.pipe(takeUntil(this.destroy$)).subscribe(() => this.onClickDebug(model, entity, marker));
        popup.setContent(popupComponentRef.location.nativeElement);
        // marker[this.popupCompAttr] = popupComponentRef;
        this.setMarkerEvents(marker, popup, popupComponentRef, entity, model);
    }

    private openPopup(marker: L.Marker, p: L.Popup, pRef: ComponentRef<PopupComponent>, entity: Entity, model: ModelDto): void {
        this.mapDashBoardService.getEntityForPopup(model, entity).pipe(takeUntil(this.destroy$)).subscribe(
            data => {
                const updatedEntity: Entity = data[0];
                pRef.instance.updatePopup(updatedEntity, model);
                pRef.changeDetectorRef.detectChanges();
                pRef.instance.refreshScroll();
                this.setTooltip(marker, updatedEntity, model);
                this.currentPopup = p;
                marker.bindPopup(p);
                marker.openPopup();
            },
        );
    }

    private closePopup(marker: L.Marker): void {
        marker.closePopup();
        marker.unbindPopup();
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
        // marker[this.tooltipAttr] = marker.getTooltip();
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
        return model.favAttr && entity[model.favAttr] ?
            ('<span>' + this.truncateTooltipContent(entity[model.favAttr]) + '</span>') :
            undefined;
    }

    private truncateTooltipContent(content: any): string {
        const str: string = JSON.stringify(content);
        return (str.length > this.tooltipMaxChars ? str.substring(0, this.tooltipMaxChars) + '...' : str);
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
        this.mapDashBoardService.getEntity(model, entity).pipe(takeUntil(this.destroy$)).subscribe(
            data => {
                if (data.length > 0) {
                    this.onClickDebugSuccess(data[0], marker, model);
                } else {
                    this.onLoadDataFail();
                }
            },
            err => {
                this.onLoadDataFail();
            },
        );
    }

    private onClickDebugSuccess(data: Entity, marker: L.Marker, model: ModelDto): void {
        marker.closePopup();
        this.displayDebugHeader = data.id;
        this.displayDebugContent = data;
        this.displayDebug = true;
        this.setTooltip(marker, data, model);
    }

}
