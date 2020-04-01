import { TreeNode } from 'primeng/api/treenode';
import { LeafletIcons } from '../../../../shared/misc/leaflet-icons';
import { Injectable } from '@angular/core';

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

    public getEntities(entities: any[]): TreeNode[] {
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

    public getAllLayers(layers: TreeNode[]): TreeNode[] {
        let concatenatedLayers: TreeNode[] = layers || [];
        if (layers) {
            layers.forEach(t => concatenatedLayers = concatenatedLayers.concat(this.getAllLayers(t.children)));
        }
        return concatenatedLayers;
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
