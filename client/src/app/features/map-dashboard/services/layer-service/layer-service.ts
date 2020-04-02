import { TreeNode } from 'primeng/api/treenode';
import { LeafletIcons } from '../../../../shared/misc/leaflet-icons';
import { Injectable } from '@angular/core';
import { EntityDto } from 'src/app/features/config-dashboard/models/entity-dto';
import { EntityConfiguration } from 'src/app/features/config-dashboard/models/context-broker-configuration';

@Injectable({
    providedIn: 'root',
})
export class LayerService {

    private readonly layers: any = {
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
            case 'AirQualityObserved': return 'environment';
            case 'OffStreetParking': return 'transport';
        }
    }

    public getMainLayers(): TreeNode[] {
        return Object.entries(this.layers).map(e => this.getTreeNodeLayer(e[0], e[1]));
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

        return treeNode;
    }

}
