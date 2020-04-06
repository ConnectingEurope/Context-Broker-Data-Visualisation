import { TreeNode } from 'primeng/api/treenode';
import { LeafletIcons } from '../../../../shared/misc/leaflet-icons';
import { Injectable } from '@angular/core';
import { EntityDto } from 'src/app/features/config-dashboard/models/entity-dto';
import { EntityConfiguration } from 'src/app/features/config-dashboard/models/context-broker-configuration';
import { CategoryDto } from '../../models/model-dto';

@Injectable({
    providedIn: 'root',
})
export class LayerService {

    private layers: any = {
        environment: {
            label: 'Environment',
            AirQualityObserved: {
                label: 'Air Quality Observed',
                icon: LeafletIcons.icons.airQualityObserved,
            },
        },
        transport: {
            label: 'Transport',
            OffStreetParking: {
                label: 'Off Street Parking',
                icon: LeafletIcons.icons.offStreetParking,
            },
        },
    };

    public getParentKey(type: string): string {
        switch (type) {
            case 'Alert':
                return 'alerts';

            case 'Park':
            case 'Garden':
            case 'FlowerBed':
            case 'GreenspaceRecord':
                return 'smartEnvironment';

            case 'AeroAllergenObserved':
            case 'AirQualityObserved':
            case 'WaterQualityObserved':
            case 'NoiseLevelObserved':
                return 'environment';

            case 'PointOfInterest':
            case 'Beach':
            case 'Museum':
            case 'TouristInformationCenter':
                return 'pointOfInterest';

            case 'Open311:ServiceType':
            case 'Open311:ServiceRequest':
                return 'civicIssuesTracking';

            case 'Streetlight':
            case 'StreetlightGroup':
            case 'StreetlightModel':
            case 'StreetlightControlCabinet':
                return 'streetLighting';

            case 'Device':
            case 'DeviceModel':
                return 'device';

            case 'TrafficFlowObserved':
            case 'CrowdFlowObserved':
            case 'BikeHireDockingStation':
            case 'EVChargingStation':
            case 'Road':
            case 'RoadSegment':
            case 'Vehicle':
            case 'VehicleModel':
                return 'transport';

            case 'KeyPerformanceIndicator':
                return 'indicators';

            case 'WasteContainerIsle':
            case 'WasteContainerModel':
            case 'WasteContainer':
                return 'wasteManagement';

            case 'OffStreetParking':
            case 'ParkingAccess':
            case 'OnStreetParking':
            case 'ParkingGroup':
            case 'ParkingSpot':
                return 'parking';

            case 'WeatherAlert':
            case 'WeatherObserved':
            case 'WeatherForecast':
                return 'weather';

            default:
                return 'generic';
        }
    }

    public getMainLayers(categories: CategoryDto[]): TreeNode[] {
        this.layers = this.createTreeNode(categories);
        return Object.entries(this.layers).map(e => this.getTreeNodeLayer(e[0], e[1]));
    }

    public createTreeNode(categories: CategoryDto[]): any {
        const layers: any = {};
        categories.forEach((category) => {
            const label: string = 'label';
            const icon: string = 'icon';
            layers[category.name] = {};
            layers[category.name][label] = category.label;
            layers[category.name][icon] = 'pi ' + category.icon;
            category.entities.forEach((entity) => {
                layers[category.name][entity.name] = {};
                layers[category.name][entity.name][label] = entity.label;
            });
        });
        return layers;
    }

    public getEntities(entities: EntityDto[]): TreeNode[] {
        const entitiesTree: TreeNode[] = [];

        entities.forEach(e => {
            entitiesTree.push({
                data: e.type,
                label: e.type,
                children: Object.keys(e.attrs).map((a: string) => ({ data: a, label: a, parent: { data: e.type } } as TreeNode)),
            });
        });

        return entitiesTree;
    }

    public getAllSelected(layers: TreeNode[]): TreeNode[] {
        let concatenatedLayers: TreeNode[] = layers || [];
        if (layers) {
            layers.forEach(t => concatenatedLayers = concatenatedLayers.concat(this.getAllSelected(t.children)));
        }
        return concatenatedLayers;
    }

    public entitiesConfigurationToTreeNodes(entities: EntityConfiguration[]): { treeNodes: TreeNode[], selectedTreeNodes: TreeNode[] } {
        const treeN: TreeNode[] = [];
        const selectedTreeN: TreeNode[] = [];

        entities.forEach(e => {
            const treeNodeChildren: TreeNode[] = [];

            e.attrs.forEach(a => {
                const treeNodeChild: TreeNode = { data: a.name, label: a.name, parent: { data: e.name } };
                treeNodeChildren.push(treeNodeChild);
                if (a.selected) { selectedTreeN.push(treeNodeChild); }
            });

            const treeNode: TreeNode = { data: e.name, label: e.name, children: treeNodeChildren };

            treeN.push(treeNode);

            if (e.selected) {
                selectedTreeN.push(treeNode);
            } else {
                this.checkIfTreeNodeIsPartialSelected(treeNode, e);
            }
        });

        return { treeNodes: treeN, selectedTreeNodes: selectedTreeN };
    }

    public treeNodesToEntitiesConfiguration(treeNodes: TreeNode[], selectedTreeNodes: TreeNode[]): EntityConfiguration[] {
        return treeNodes.map(t => {
            return {
                name: t.data,
                selected: this.isTreeNodeSelected(t, selectedTreeNodes),
                attrs: t.children.map(c => ({
                    name: c.data,
                    selected: this.isTreeNodeSelected(c, selectedTreeNodes),
                })),
            };
        });
    }

    private checkIfTreeNodeIsPartialSelected(treeNode: TreeNode, e: EntityConfiguration): void {
        if (e.attrs.some(a => a.selected)) {
            treeNode.partialSelected = true;
        }
    }

    private isTreeNodeSelected(treeNode: TreeNode, selectedTreeNodes: TreeNode[]): boolean {
        return treeNode.partialSelected || selectedTreeNodes.some(t => treeNode === t);
    }

    private getTreeNodeLayer(key: string, value: any): TreeNode {
        const children: any[] = Object.entries(value).filter(e => e[0] !== 'label' && e[0] !== 'icon');
        const treeNode: TreeNode = {};

        treeNode.data = key;
        treeNode.label = value.label;
        treeNode.children = children.map(c => this.getTreeNodeLayer(c[0], c[1]));
        if (value.icon) {
            treeNode.expandedIcon = value.icon;
            treeNode.collapsedIcon = value.icon;
        }

        return treeNode;
    }

}
