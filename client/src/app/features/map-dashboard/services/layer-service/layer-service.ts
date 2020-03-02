import { TreeNode } from 'primeng/api/treenode';
import { LeafletIcons } from '../../../../shared/leaflet-icons';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LayerService {

    private readonly layers = {
        environment: {
            label: 'Environment',
            airQualityObserved: {
                label: 'Air Quality Observed',
                icon: LeafletIcons.airQualityIcon,
            },
        },
        transport: {
            label: 'Transport',
            parking: {
                label: 'Parkings',
                icon: LeafletIcons.parkingIcon,
            },
        },
    };

    public getMainLayers(): TreeNode[] {
        return Object.entries(this.layers).map(e => this.getTreeNodeLayer(e[0], e[1]));
    }

    public getAllLayers(layers: TreeNode[]): TreeNode[] {
        let concatenatedLayers = layers;
        layers.forEach(t => concatenatedLayers = concatenatedLayers.concat(this.getAllLayers(t.children)));
        return concatenatedLayers;
    }

    private getTreeNodeLayer(key: string, value: any): TreeNode {
        const children = Object.entries(value).filter(e2 => e2[0] !== 'label' && e2[0] !== 'icon');
        const treeNode: TreeNode = {};

        treeNode.data = key;
        treeNode.label = value.label;
        treeNode.children = children.map(c => this.getTreeNodeLayer(c[0], c[1]));

        return treeNode;
    }

}
