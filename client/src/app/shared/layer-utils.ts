import { TreeNode } from 'primeng/api/treenode';
import { LeafletIcons } from './leaflet-icons';
import { Injectable } from '@angular/core';


export class LayerUtils {

    static readonly layers = {
        environment: {
            label: 'Environment',
            airQuality: {
                label: 'Air Quality',
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

    static readonly PARKING: TreeNode = { data: 'parking', label: 'Parkings' };
    static readonly BIKE_STATION: TreeNode = { data: 'bikeStation', label: 'Bike stations' };
    static readonly BUS: TreeNode = { data: 'bus', label: 'Buses' };
    static readonly TRANSPORT: TreeNode = {
        data: 'transport',
        label: 'Transport',
        children: [
            LayerUtils.PARKING,
            LayerUtils.BIKE_STATION,
            LayerUtils.BUS,
        ],
    };

    static readonly AIR_QUALITY: TreeNode = { data: 'airQuality', label: 'Air Quality' };
    static readonly ENVIRONMENT: TreeNode = {
        data: 'environment',
        label: 'Environment',
        children: [
            LayerUtils.AIR_QUALITY,
        ],
    };

    static readonly MAIN_LAYERS: TreeNode[] = [
        LayerUtils.TRANSPORT,
        LayerUtils.ENVIRONMENT,
    ];
    static readonly ALL_LAYERS: TreeNode[] = [
        LayerUtils.PARKING,
        LayerUtils.BIKE_STATION,
        LayerUtils.BUS,
        LayerUtils.TRANSPORT,
        LayerUtils.AIR_QUALITY,
        LayerUtils.ENVIRONMENT,
    ];


    public getMainLayers(): TreeNode[] {
        return Object.entries(LayerUtils.layers).map(e => this.getTreeNodeLayer(e[0], e[1]));
    }

    private getTreeNodeLayer(key: string, value: any): TreeNode {
        const children = Object.entries(value).filter(e2 => e2[0] !== 'label' && e2[0] !== 'icon');
        const treeNode: TreeNode = {};

        treeNode.data = key;
        treeNode.label = value.data;
        treeNode.children = children.map(c => this.getTreeNodeLayer(c[0], c[1]));

        return treeNode;
    }

    private getAllLayers(layers: TreeNode[]): TreeNode[] {
        const children = [];
        layers.forEach(t => children.push(this.getAllLayers(t.children)));
        return layers.concat(children);
    }

}
