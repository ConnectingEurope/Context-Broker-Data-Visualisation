import { TreeNode } from 'primeng/api/treenode';
import { Injectable } from '@angular/core';
import { CategoryFilter } from '../models/category-filter';

@Injectable({
    providedIn: 'root',
})
export class LayerTreeNodeService {

    public getMainLayers(categories: CategoryFilter[]): TreeNode[] {
        const layers: any = this.createTreeNode(categories);
        return Object.entries(layers).map(e => this.getTreeNodeLayer(e[0], e[1]));
    }

    public createTreeNode(categories: CategoryFilter[]): any {
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
